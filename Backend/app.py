from chalice import Chalice
from chalicelib.helper import CognitoHelper, Validations, Request, Response, GeneralHelper
from chalice import CORSConfig

import json
import os
import boto3
import hashlib
import time
import chalicelib.recursive_stringification as rs
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime
import base64
from botocore.client import Config
# import pandas as pd

bucket = "handyy-assets"
bucket_access_point = "arn:aws:s3:ap-south-1:348036267587:accesspoint/sample-access-point"
expiration = 3600
poolARN = 'arn:aws:cognito-idp:ap-south-1:348036267587:userpool/ap-south-1_WIQaIBIAS'
poolName = 'handyyamplifybc6d0455_userpool_bc6d0455-dev'
userPoolID = 'ap-south-1_WIQaIBIAS'
country_code = "+91"

app = Chalice(app_name='handyy-app')
authorizer = CognitoHelper.get_authorizer()
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['accesstoken']
)

@app.route('/', methods=['GET'], cors=cors_config)
def index():
    cognito_client = boto3.client('cognito-idp')
    s3client       = boto3.resource('s3')
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    return {'hello': 'world'}

# Autocomplete districts
@app.route('/districts', methods=['GET'], cors=cors_config)
def districts_autocomplete():
    filename = os.path.join(os.path.dirname(__file__), 'chalicelib', 'districts.json')
    with open(filename, "r") as f:
        districts = json.load(f)
    return Response.respond(None, districts)

@app.route('/district-states', methods=['GET'], cors=cors_config)
def districts_autocomplete():
    filename = os.path.join(os.path.dirname(__file__), 'chalicelib', 'district-states.json')
    with open(filename, "r") as f:
        districts = json.load(f)
    return Response.respond(None, districts)

# Login for all users
@app.route('/login', methods=['POST'], authorizer = authorizer, cors=cors_config)
def login():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except:
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    user_type = "advocate"
    if "support" in cognito_groups:
        user_type = "support"
    if "administrator" in cognito_groups:
        user_type = "administrator"
    
    if user_type == "advocate":
        itemDetails = advocates_info.get_item(Key = {'user_id' : user_id})
        if "Item" in itemDetails:
            itemDetails = itemDetails["Item"]
            if itemDetails:
                itemDetails["isRegistered"] = 1
                itemDetails["user_type"] = user_type
                return Response.respond(None, itemDetails)
        nowDate = datetime.now()
        item = {}
        item["user_id"] = user_id
        item["registration_time"] = nowDate
        item["registration_date"] = nowDate.date()
        item["status"] = "Active"
        item["subscription_type"] = "Freemium"
        payload = rs.checkifID(item)
        payload = rs.recursiveStringification(item)
        response = advocates_info.put_item(Item = payload)
        payload["isRegistered"] = 0
        payload["user_type"] = user_type
        return Response.respond(None, payload)
    
    payload = {}
    payload["user_type"] = user_type
    return Response.respond(None, payload)

# Get list of advocates
@app.route('/get_advocate_list', methods=['GET'], authorizer=authorizer, cors=cors_config)
def get_advocate_list():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    cognito_client = boto3.client('cognito-idp')
    params = Request.get_request_params("GET", app.current_request)

    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except:
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    user_type = "advocate"
    if "support" in cognito_groups:
        user_type = "support"
    if "administrator" in cognito_groups:
        user_type = "administrator"
    if user_type not in ["support", "administrator"]:
        # Only allowed roles
        err = {}
        err["code"] = "403"
        err['message'] = "Authorization error"
        return Response.respond(err)

    allAdvocates = advocates_info.scan()["Items"]

    if len(allAdvocates) == 0:
        err = {}
        err['code'] = "404"
        err["message"] = "No cases found"
        return Response.respond(err)
    
    advocatesReturn = []
    for advocate in allAdvocates:
        advocateTemp = {}
        advocateTemp["id"] = advocate["user_id"]
        advocateTemp["registration_date"] = advocate["registration_date"]
        advocateTemp["status"] = advocate["status"]
        advocateTemp["subscription_type"] = advocate["subscription_type"]
        advocateTemp["last_activity"] = "3 days ago"
        UserAttributes = cognito_client.admin_get_user(
            Username=advocate["user_id"],
            UserPoolId=userPoolID,
        )["UserAttributes"]
        for userAttribute in UserAttributes:
            if userAttribute["Name"] == "email":
                advocateTemp["email"] = userAttribute["Value"]
        filterPassed = 1
        try:
            case_datetime = datetime.strptime(advocateTemp["registration_date"], "%Y-%m-%d")
            if "start_date" in params:
                try:
                    start_datetime = datetime.strptime(params["start_date"], "%Y-%m-%d")
                except:
                    err = {"message":["Wrong format for date {}".format(params["start_date"])]}
                    return Response.respond(err)
                if case_datetime < start_datetime:
                    filterPassed = 0
            if "end_date" in params and filterPassed == 1:
                try:
                    end_datetime = datetime.strptime(params["end_date"], "%Y-%m-%d")
                except:
                    err = {"message":["Wrong format for date {}".format(params["end_date"])]}
                    return Response.respond(err)
                if case_datetime > end_datetime:
                    filterPassed = 0
        except Exception as e:
            print("Filter application issue")
        if filterPassed == 1:
            advocatesReturn.append(advocateTemp)

    return Response.respond(None, advocatesReturn)  

@app.route('/get_admin_reports', methods=['GET'], authorizer=authorizer, cors=cors_config)
def admin_reports():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    cognito_client = boto3.client('cognito-idp')
    params = Request.get_request_params("GET", app.current_request)

    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except:
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    user_type = "advocate"
    if "support" in cognito_groups:
        user_type = "support"
    if "administrator" in cognito_groups:
        user_type = "administrator"
    if user_type not in ["administrator"]:
        # Only allowed roles
        err = {}
        err["code"] = "403"
        err['message'] = "Authorization error"
        return Response.respond(err)

    responseObj = {
        "total_sales": 0,
        "sales_today_prc": 0,
        "sales_month": 0,
        "sales_month_prc": 0,
        "num_subscriptions": 0,
        "sign_up_prc": 0
    }

    return Response.respond(None, responseObj)


# Update advocate
@app.route('/update-advocate', methods=['POST'], authorizer = authorizer, cors=cors_config)
def edit_advocate():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except:
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    user_type = "advocate"
    if "support" in cognito_groups:
        user_type = "support"
    if "administrator" in cognito_groups:
        user_type = "administrator"
    if user_type not in ["support", "administrator"]:
        # Only allowed roles
        err = {}
        err["code"] = "403"
        err['message'] = "Authorization error"
        return Response.respond(err)

    required_keys = ['id']
    params = Request.get_request_params("POST", app.current_request)
        
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)
        
    params["updated_at"] = datetime.today().strftime('%Y-%m-%d')
    itemDetails = advocates_info.get_item(Key = {'user_id' : params["id"]})
    if "Item" in itemDetails:
        itemDetails = itemDetails["Item"]
        if itemDetails:
            updateKeys = ["status", "subscription_type", "updated_at"]
            for updateKey in updateKeys:
                if updateKey in params:
                    advocates_info.update_item(Key = {"user_id": params["id"]}, AttributeUpdates = {updateKey: {"Value": params[updateKey], "Action": "PUT"} })
            return Response.respond(None, {"message": "Advocate updated!"})
    err = {}
    err['code'] = "404"
    err["message"] = "Advocate not found"
    return Response.respond(err)

# Advocate account details
@app.route('/adv-account-details', methods=['GET'], authorizer = authorizer, cors=cors_config)
def adv_get_account_details():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)
    
    itemDetails = advocates_info.get_item(Key = {'user_id' : user_id})
    
    if "Item" in itemDetails:
        return Response.respond(None, itemDetails["Item"])
    err = {}
    err['code'] = "404"
    err["message"] = "Advocate not found"
    return Response.respond(err)

# Update Advocate account details
@app.route('/adv-account-details', methods=['POST'], authorizer = authorizer, cors=cors_config)
def adv_edit_account_details():
    dynamodb       = boto3.resource('dynamodb', region_name='ap-south-1')
    advocates_info = dynamodb.Table('advocate_info_test')

    params = Request.get_request_params("POST", app.current_request)
    required_keys = ['basic_info', 'enrollment_info']
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)

    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)
    
    itemDetails = advocates_info.get_item(Key = {'user_id' : user_id})
    
    if "Item" in itemDetails:
        updateKeys = ["basic_info", "enrollment_info"]
        for updateKey in updateKeys:
            if updateKey in params:
                advocates_info.update_item(Key = {"user_id": user_id}, AttributeUpdates = {updateKey: {"Value": params[updateKey], "Action": "PUT"} })    
    else:
        err = {}
        err['code'] = "404"
        err["message"] = "Advocate not found"
        return Response.respond(err)

    return Response.respond(None, {"message": "Account updated!"})

# Get cases list
@app.route('/pcm-list', methods=['GET'], authorizer = authorizer, cors=cors_config)
def get_pcm_list():

    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
    cases    = dynamodb.Table('cases')
    params   = Request.get_request_params("GET", app.current_request)
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
        advocate_info = CognitoHelper.get_advocate_info(user_id)
        advocate_id = advocate_info["id"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)
    
    allCases = cases.scan(FilterExpression = Attr('advocate_id').eq(advocate_id))["Items"]
    if len(allCases) == 0:
        err = {}
        err['code'] = "404"
        err["message"] = "No cases found"
        return Response.respond(err)
    
    casesToReturn = []    
    for i in range(len(allCases)):
        allCases[i]["last_activity"] = "Less than 1 day ago" #Get last activity date => to be done
        filterPassed = 1
        try:
            case_datetime = datetime.strptime(allCases[i]["case_details"]["registration_date"], "%Y-%m-%d")
            if "start_date" in params:
                try:
                    start_datetime = datetime.strptime(params["start_date"], "%Y-%m-%d")
                except:
                    err = {"message":["Wrong format for date {}".format(params["start_date"])]}
                    return Response.respond(err)
                if case_datetime < start_datetime:
                    filterPassed = 0
            if "end_date" in params and filterPassed == 1:
                try:
                    end_datetime = datetime.strptime(params["end_date"], "%Y-%m-%d")
                except:
                    err = {"message":["Wrong format for date {}".format(params["end_date"])]}
                    return Response.respond(err)
                if case_datetime > end_datetime:
                    filterPassed = 0
        except Exception as e:
            print("Filter application issue")
        if filterPassed == 1:
            casesToReturn.append(allCases[i])
    response = {
        "advocate_id": advocate_id,
        "cases": casesToReturn
    }
    return Response.respond(None, response)

# Get details of case
@app.route('/pcm-details', methods=['GET'], authorizer = authorizer, cors=cors_config)
def get_pcm_details():  
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
        advocate_info = CognitoHelper.get_advocate_info(user_id)
        advocate_id = advocate_info["id"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)
    
    s3client = boto3.client('s3', config = Config(signature_version = 's3v4'))
    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
    cases    = dynamodb.Table('cases')
    params = Request.get_request_params("GET", app.current_request)
    required_keys = ['case_num']
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)

    itemDetails = cases.get_item(Key = {'case_num' : params["case_num"]})
    if "Item" in itemDetails:
        itemDetails = itemDetails["Item"]
        docs = []
        objects = s3client.list_objects_v2(
            Bucket = bucket_access_point,
            Prefix = "{}/{}".format(advocate_id, params["case_num"])
        )
        if "Contents" in objects:
            contents = objects["Contents"]
            for content in contents:
                responseObj = {}
                responseObj["extension"] = content["Key"].split(".")[-1]
                responseObj["name"] = content["Key"].split("/")[-1]
                responseObj["size"] = content["Size"]
                responseObj["item_key"] = content["Key"]
                responseObj["value"] = base64.b64encode(s3client.get_object(
                    Bucket = bucket_access_point,
                    Key = content["Key"]
                )["Body"].read()).decode()
                    # response = s3client.generate_presigned_url('get_object',
                    #                                 Params={'Bucket': bucket_access_point,
                    #                                         'Key': content["Key"]},
                    #                                 ExpiresIn=expiration)
                docs.append(responseObj)
                
        itemDetails["documents"] = docs
        return Response.respond(None, itemDetails)
    err = {}
    err["code"] = "404"
    err['message'] = "Case not found"
    return Response.respond(err)

# Add/Edit case
@app.route('/pcm', methods=['POST'], authorizer = authorizer, cors=cors_config)
def edit_pcm():

    dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
    cases    = dynamodb.Table('cases')

    required_keys = ['case_num']
    params = Request.get_request_params("POST", app.current_request)
        
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)
        
    params["updated_at"] = datetime.today().strftime('%Y-%m-%d')
    itemDetails = cases.get_item(Key = {'case_num' : params["case_num"]})
    if "Item" in itemDetails:
        itemDetails = itemDetails["Item"]
        if itemDetails:
            updateKeys = ["party", "case_details", "updated_at"]
            if "party" in params and "case_details" in params:
                party = params["party"]
                case_details = params["case_details"]
                if len(party) >= 1 and "phone" in party[0] and "name" in party[0] and "adjourn_date" in case_details:
                    if "case_details" in itemDetails and "adjourn_date" in itemDetails["case_details"] and itemDetails["case_details"]["adjourn_date"] != case_details["adjourn_date"]:
                        print("Sending Message..")
                        GeneralHelper.send_message(party[0]["phone"], party[0]["name"], case_details["adjourn_date"])
            for updateKey in updateKeys:
                if updateKey in params:
                    cases.update_item(Key = {"case_num": params["case_num"]}, AttributeUpdates = {updateKey: {"Value": params[updateKey], "Action": "PUT"} })
            return Response.respond(None, {"message": "Case updated!"})
    payload = rs.recursiveStringification(params)
    response = cases.put_item(Item = payload)
    if "party" in params and "case_details" in params:
        party = params["party"]
        case_details = params["case_details"]
        if len(party) >= 1 and "phone" in party[0] and "name" in party[0] and "adjourn_date" in case_details:
            GeneralHelper.send_message(party[0]["phone"], party[0]["name"], case_details["adjourn_date"])
    return Response.respond(None, {"message": "Case added!"})

#Upload docs
@app.route('/upload-docs', methods=['POST'], authorizer = authorizer, cors=cors_config)
def upload_docs():

    s3client = boto3.client('s3', config = Config(signature_version = 's3v4'))

    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
        advocate_info = CognitoHelper.get_advocate_info(user_id)
        advocate_id = advocate_info["id"]
    except Exception as e:
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)
    required_keys = ["case_num", "doc", "doc_name"]
    params = Request.get_request_params("POST", app.current_request)
        
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)
            
    try:
        doc = base64.b64decode(params["doc"])
    except Exception as e:
        err = {}
        err["code"] = "405"
        err['message'] = "Doc format invalid"
        return Response.respond(err)
        
    s3client.put_object(
        ACL = "private", 
        Body = doc,
        Bucket = bucket,
        Key = "{}/{}/{}".format(advocate_id, params["case_num"], params["doc_name"]),
        ServerSideEncryption = "aws:kms"
    )        
    return Response.respond(None, {"message": "Doc uploaded!"})

#Delete docs
@app.route('/delete-docs/{case_num}/{file_name}', methods=['DELETE'], authorizer = authorizer, cors=cors_config)
def delete_docs(case_num, file_name):

    s3client = boto3.client('s3', config = Config(signature_version = 's3v4'))

    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
        advocate_info = CognitoHelper.get_advocate_info(user_id)
        advocate_id = advocate_info["id"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    key = "{}/{}/{}".format(advocate_id, case_num, file_name)
    response = s3client.delete_object(
        Bucket = bucket_access_point,
        Key = key
    )
    return Response.respond(None, {"message": "Doc deleted!"})

#Documenting - search docs
@app.route('/documents/list', methods = ['GET'], authorizer = authorizer, cors=cors_config)
def documents_list():
    # try:
    #     user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
    #     cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
    #     advocate_info = CognitoHelper.get_advocate_info(user_id)
    #     advocate_id = advocate_info["id"]
    # except Exception as e:
    #     print(e)
    #     err = {}
    #     err["code"] = "401"
    #     err['message'] = "Authorization error"
    #     return Response.respond(err)
    
    s3client = boto3.client('s3', config = Config(signature_version = 's3v4'))
    objects = s3client.list_objects_v2(
        Bucket = bucket_access_point,
        Prefix = "documenting"
    )
    docs = []
    if "Contents" in objects:
        contents = objects["Contents"]
        for content in contents:
            responseObj = {}
            responseObj["extension"] = content["Key"].split(".")[-1]
            responseObj["name"] = content["Key"].split("/")[-1]
            responseObj["tags"] = content["Key"].split("/")[1:]
            responseObj["item_key"] = content["Key"]
            if responseObj["name"] != "":
                docs.append(responseObj)

    if len(docs) > 0:
        resp = {}
        resp["documents"] = docs
        return Response.respond(None, resp)
    err = {}
    err["code"] = "404"
    err['message'] = "Document not found"
    return Response.respond(err)

@app.route('/document/download', methods = ['GET'], authorizer = authorizer, cors=cors_config)
def document_download():
    try:
        user_id = app.current_request.context["authorizer"]["claims"]["cognito:username"]
        cognito_groups = app.current_request.context["authorizer"]["claims"]["cognito:groups"]
        advocate_info = CognitoHelper.get_advocate_info(user_id)
        advocate_id = advocate_info["id"]
    except Exception as e:
        print(e)
        err = {}
        err["code"] = "401"
        err['message'] = "Authorization error"
        return Response.respond(err)

    print("Advocate ID: {}".format(advocate_id))
    params = Request.get_request_params("GET", app.current_request)
    required_keys = ['doc_key', 'name']
    required_error = Validations.required_validation(required_keys, params.keys())
    if required_error:
        return Response.respond(required_error)

    s3client = boto3.client('s3', config = Config(signature_version = 's3v4'))

    try:
        resp = {}
        resp["document_details"] = base64.b64encode(s3client.get_object(
            Bucket = bucket_access_point,
            Key = params["doc_key"]
        )["Body"].read()).decode()
        # Add to frequently downloaded
        return Response.respond(None, resp)
    except:
        err = {}
        err["code"] = "404"
        err['message'] = "Document not found"
        return Response.respond(err)


# Frequently downloaded

# Citation