import { RESTAPI } from "../../rest-api";
import { axiosGet, axiosPost } from './http-request-service';

export const GetAccountDetails = () => {
    return axiosGet(RESTAPI.GETACCOUNTDETAILS)    
    .then((response) => {        
        const response_data = JSON.parse(response.body);
        return response_data;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const AddAccountDetails = (data) => {
    return axiosPost(RESTAPI.GETACCOUNTDETAILS, data)    
    .then((response) => {        
        const response_data = JSON.parse(response.body);
        return response_data;
    })
    .catch((err) => {
        // console.log(err);
    });
}