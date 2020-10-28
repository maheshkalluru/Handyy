import boto3
from chalice import Chalice
from chalice import CognitoUserPoolAuthorizer, CORSConfig
import json

poolARN = 'arn:aws:cognito-idp:ap-south-1:348036267587:userpool/ap-south-1_WIQaIBIAS'
poolName = 'handyyamplifybc6d0455_userpool_bc6d0455-dev'
userPoolID = 'ap-south-1_WIQaIBIAS'

class CognitoHelper:
    @staticmethod
    def get_authorizer():
        authorizer = CognitoUserPoolAuthorizer(poolName, header='Authorization', provider_arns=[poolARN])
        return authorizer
    
    @staticmethod
    def check_if_admin(access_token):
        client = boto3.client('cognito-idp')
        response = client.get_user(
           AccessToken=access_token
        )        
        username = response['Username']
        groups_response = client.admin_list_groups_for_user(
            Username=username,
            UserPoolId=userPoolID,
        )
        groups = []
        for gr in groups_response['Groups']:
            groups.append(gr['GroupName'])
            if 'Administrators' in groups:
                return True
        return False

    def get_advocate_info(user_id):

        dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
        advocates_info = dynamodb.Table('advocate_info_test')
        itemDetails = advocates_info.get_item(Key = {'user_id' : user_id})
    
        if "Item" in itemDetails:
            itemDetails = itemDetails["Item"]
            return itemDetails
        return False

class SetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


class Request:
    def get_request_params(method, current_request):
        if method == "GET":
            params = current_request.query_params
        if method == "POST":
            params = current_request.json_body

        if params == None:
            params = {}
        return params

class Response:
    def respond(err, res=None):
        return {
            'statusCode': err['code'] if err else '200',
            'body': err['message'] if err else json.dumps(res, cls=SetEncoder),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
        
class Validations:

    def required_validation(should_be_keys, given_keys):
        err_message = []
        for k in (should_be_keys - given_keys):
            err_message.append("{} is required".format(k))
            
        if (err_message):
            err = {}
            err['code'] = "402"
            err['message'] = err_message[0]
            return err
        return False


class GeneralHelper:

    def send_message(phone, party_name, adjourn_date):
        sns = boto3.client('sns')
        number = "+91{}".format(phone)
        message = "Hello {}, Your case has been adjourned to {}.".format(
                    party_name, adjourn_date
            )
        resp = sns.publish(PhoneNumber = number, Message=message, Subject = "SampleGroup")
        print(resp)
        return True