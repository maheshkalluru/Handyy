import { RESTAPI} from '../../rest-api';
import { axiosGet } from './http-request-service';

export const GetCurrentUser = () => {
    const user = localStorage.getItem('handyyUser');
    return user != undefined ? JSON.parse(localStorage.getItem('handyyUser')) : null;
}

export const GetCognitoUserData = () => {
    const cognitoUser = localStorage.getItem('userData');
    return cognitoUser != undefined ? JSON.parse(localStorage.getItem('userData')) : null;
}

export const GetCurrentUserAdvocateId = () => {
    const user = GetCurrentUser();
    if(user) return user.id;
    else return null;
}

export const isNumberKey = (evt) => {
    // console.log(evt);
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) evt.preventDefault();
    // return true;
}

export const getDistricts = () => {
    return axiosGet(RESTAPI.GETDISTRICTS)
    .then((response) => {        
        const response_data = JSON.parse(response.body);
        return response_data;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const getDistrictsStates = () => {
    return axiosGet(RESTAPI.GET_DISTRICTS_STATES)
    .then((response) => {        
        const response_data = JSON.parse(response.body);
        return response_data;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const getActiveItems = () => {
    const activeItems = localStorage.getItem('currentActiveItems');
    return activeItems != undefined ? JSON.parse(localStorage.getItem('currentActiveItems')) : null;
}

export const getCurrentActiveCase = () => {
    const activeItem = getActiveItems();
    return activeItem ? activeItem.ccn : ""
}

export const setCurrentCaseNumber = (case_number) => {
    let activeItem = getActiveItems();
    activeItem.ccn = case_number;
    localStorage.setItem('currentActiveItems', JSON.stringify(activeItem));

}