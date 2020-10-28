import { RESTAPI } from "../../rest-api";
import { axiosPost } from './http-request-service';

const LoginService = () => {

    return axiosPost(RESTAPI.LOGIN)  
    .then((response) => {
        // console.log(response);
        if(response.statusCode === '200')
            return JSON.parse(response.body);
    })
    .catch((err) => {
        // console.log(err);
    });
    
};

export default LoginService;
