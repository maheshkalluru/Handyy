import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Breadcrumb, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Home } from '@material-ui/icons';
import { useHistory, Redirect } from "react-router-dom";
import { GetCurrentUser, GetCurrentUserAdvocateId, isNumberKey, GetCognitoUserData, getDistrictsStates } from '../../Services/common-service';
import { GetAccountDetails, AddAccountDetails } from '../../Services/account-service';
import Can from "../Can";
import rules from "../../../rbac-rules";
import { notifySuccess, notifyError } from '../../Services/toaster-service';

const InitialAccountData = {
    first_name: "",
    last_name: "",
    phone: "",
    address: "",    
    state: "",
    country: "India",
    enrollment_bar: "",
    enrollment_number: "",
    enrollment_date: ""
}


const Account = () => {

    const [accountData, setAccountData] = useState(InitialAccountData);
    const [isFormValid, setFormValidation] = useState(false);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);

    const advocate_id = GetCurrentUserAdvocateId();
    const user = GetCognitoUserData();
    let history = useHistory();
    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    const profile = useCallback(()=> {        
        GetAccountDetails().then((response) => {
            // console.log(response);
            if(response && response.basic_info){
                setAccountData({
                    first_name: response.basic_info.first_name,
                    last_name: response.basic_info.last_name,
                    phone: response.basic_info.phone,
                    address: response.basic_info.address,    
                    state: response.basic_info.state,
                    country: response.basic_info.country,
                    enrollment_bar: response.enrollment_info.enrollment_bar,
                    enrollment_number: response.enrollment_info.enrollment_number,
                    enrollment_date: response.enrollment_info.enrollment_date
                })
                setFormValidation(true);
            }else{
                setAccountData({
                    ...InitialAccountData,
                    first_name: user ? user.given_name: '',
                    last_name: user ? user.family_name: '',
                })            
            }
        })
        getDistrictsStates().then(response => {        
            setStates(response.states);
            setCountries(response.countries);
        });
    }, []);
   
    useEffect(() => {
        profile();
    }, [profile])      

    const handleInputChange = (event) => {
        // console.log(event);
        checkFormValidation(event);                
        setAccountData({
            ...accountData,        
            // Trimming any whitespace .trim()
            [event.target.name]: event.target.value            
        });
    };

    const checkFormValidation = (event) => {
        switch(event.target.name){
            case 'name':
                // if(event.target.value == '') setPartyNameError(true);
                // else setPartyNameError(false);
                break;
            case 'enrollment_number':
                if(event.target.value == ''){
                    setFormValidation(false);                    
                }else{
                    setFormValidation(true);                    
                }
                break;
            default:               
                break;
        }
    }
    
    const handleSubmit = (event) => {
        // console.log(event);
        event.preventDefault()
        // console.log(accountData);
        let data = {            
            basic_info: 
                {
                    "first_name": accountData.first_name,
                    "last_name" : accountData.last_name,
                    "phone": accountData.phone,
                    "address": accountData.address,
                    "state": accountData.state,
                    "country": accountData.country
                },
            enrollment_info: {
                "enrollment_bar": accountData.enrollment_bar,
                "enrollment_number": accountData.enrollment_number,
                "enrollment_date": accountData.enrollment_date
            }
        }
        
        AddAccountDetails(data).then(response => {            
            if(response){                                
                notifySuccess(response.message);
                history.push('/home');
            }else{
                // console.log('error');
                notifyError("Something went wrong!");
            }
        });
    };

    return <Can
        role={user_type}
        perform="editaccount:visit"
        yes={() => (
            <>
            <Container fluid style={{paddingTop: '12px'}}>
                <Row className="item-flex-center m-0">
                    <Row className="item-flex-start m-0">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">
                                <Home className="breadcrumb-home-icon"></Home>
                            </Breadcrumb.Item>                   
                            <Breadcrumb.Item active className="breadcrumb-active">EDIT ACCOUNT</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="m-0">Edit Account</h1>
                    </Row>                                                        
                </Row>            
            </Container>
            <Container fluid style={{paddingTop: '18px'}}>
                <Row>
                    <Col lg={12} className="mt-2">
                        <div className="container-fluid page__container p-0">
                            <form>
                                <div className="card card-form">
                                    <div className="row no-gutters">
                                        <div className="col-lg-4 card-body">
                                            <p><strong className="headings-color">Basic Information</strong></p>
                                            <p className="text-muted">Edit your account details and settings.</p>
                                        </div>
                                        <div className="col-lg-8 card-form__body card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="first_name">First name</label>
                                                        <input id="first_name" name="first_name" type="text" className="form-control" placeholder="First name" value={accountData.first_name} onChange={handleInputChange} required/>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="last_name">Last name</label>
                                                        <input id="last_name" name="last_name" type="text" className="form-control" placeholder="Last name" value={accountData.last_name} onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input id="phone" name="phone" type="text" className="form-control account-phone-input" placeholder="Enter Phone Number" value={accountData.phone} minLength="10" maxLength="10" onKeyPress={isNumberKey} onChange={handleInputChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Address</label>
                                                <textarea id="address" name="address" rows="4" className="form-control" placeholder="Bio / description ..." value={accountData.address} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="state">State</label><br/>
                                                <select id="state" name="state" className="custom-select" style={{width: "111px"}} value={accountData.state} onChange={handleInputChange}>
                                                    {states.map((state, i) =>
                                                        <option value={state} key={i}>
                                                            {state}
                                                        </option>
                                                    )}
                                                </select>
                                                <small className="form-text text-muted">The country is not visible to other users.</small>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="country">Country</label><br/>
                                                <select id="country" name="country" className="custom-select" style={{width: "111px"}} value={accountData.country} onChange={handleInputChange}>
                                                    {countries.map((country, i) =>
                                                        <option value={country} key={i}>
                                                            {country}
                                                        </option>
                                                    )}
                                                </select>
                                                <small className="form-text text-muted">The country is not visible to other users.</small>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="card card-form">
                                    <div className="row no-gutters">
                                        <div className="col-lg-4 card-body">
                                            <p><strong className="headings-color">Enrollment Details</strong></p>
                                        </div>
                                        <div className="col-lg-4 card-form__body card-body">
                                            <div className="form-group">
                                                <label htmlFor="enrollment_bar">Enrollment BAR</label>
                                                <input id="enrollment_bar" name="enrollment_bar" type="text" className="form-control" placeholder="" value={accountData.enrollment_bar} onChange={handleInputChange} required/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="enrollment_number">Enrollment Number</label>
                                                <input id="enrollment_number" name="enrollment_number" type="text" className={`form-control ${ !accountData.enrollment_number ? 'is-invalid': ''}`} value={accountData.enrollment_number} onChange={handleInputChange} />
                                                { !accountData.enrollment_number ? <small className="invalid-feedback">Must not be empty.</small> : ''}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="enrollment_date">Enrollment Date</label>
                                                <input id="enrollment_date" name="enrollment_date" type="date" className="form-control" placeholder="Enrollment Date" value={accountData.enrollment_date} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="text-right mb-5">
                                    <button type="submit" className="btn btn-success" onClick={handleSubmit} disabled={!isFormValid}>Save</button>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>                
            </Container>            
        </>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
  />; 

    // return <Can
    // role={user_type}
    // perform="citation:visit"> (
       
    //     )</Can>
    // );
}

export default Account;