import axios from 'axios';
import { CONFIG } from '../../config';
import { notifySuccess, notifyError, notifyInfo } from '../Services/toaster-service';
import Amplify, { Auth, Hub } from "aws-amplify";

let tokens = { idToken: '', accessToken: ''};

const http = axios.create({
    baseURL: CONFIG.baseApiHost
})

const getTokens = () => {
    return Auth.currentAuthenticatedUser()
    .then((userData) => {
        tokens.idToken = userData.signInUserSession.idToken.jwtToken;
        tokens.accessToken = userData.signInUserSession.accessToken.jwtToken;
        return tokens;
    })
    .catch(() => console.log("Not signed in"));
}

const axiosRequestHandler = (request) => {
    return getTokens().then(({idToken, accessToken}) => {
        request.headers['Authorization'] = 'Bearer ' + idToken;
        request.headers['AccessToken'] = accessToken;
        request.headers['Content-Type'] = 'application/json';
        return request;
    })
    .catch((error)=> {
        // console.log('error on intercepting request...');
        return Promise.reject(error);
    });    
}

const axiosResponseHandler = (response) => {
    return response;
}

const axiosResponseErrorHandler = (error) => {
    // console.log(error);
    // console.log(error.status);
    // if(error.message === 'Network Error' && !error.response){
    //     notifyError('Network Error!');
    // }

    // const { status, data, config } = error.response;

    // switch (status) {
    //     case 404:
    //         notifyError('Not Found!');            
    //         break;
    //     case 500:
    //         notifyError('Server Error!');
    //         break;    
    //     default:
    //         notifyError('Something went wrong!');
    //         break;  
    // }

}

http.interceptors.request.use(
    request => axiosRequestHandler(request),
    error => Promise.reject(error)
);

http.interceptors.response.use(
    response => axiosResponseHandler(response),
    error => axiosResponseErrorHandler(error)
);

export const axiosGet = (api, queryParams={}) => {
    return http.get(api, {params: queryParams})
    .then(response => {
        // console.log(response);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
    })
}

export const axiosPost = (api, body = {}) => {

    return http.post(api, JSON.stringify(body))
    .then(response => {
        // console.log(response);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
    })
}

export const axiosDelete = (api, body = {data: {}}) => {    
    return http.delete(api, body)
    .then(response => {        
        return response.data;
    })
    .catch(error => {
        // console.log(error);
    })
}
