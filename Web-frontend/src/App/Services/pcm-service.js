import { RESTAPI } from "../../rest-api";
import { axiosGet, axiosPost, axiosDelete } from './http-request-service';

export const GetPCMLists = (startDate='', endDate='') => {

    
    let params = {};
    if(startDate && endDate){
        params["start_date"] = startDate;
        params["end_date"] = endDate;
    }
    
    return axiosGet(RESTAPI.GETADVOCATE, params)
        .then((response) => {
            if(response.statusCode != "200"){
                return {};
            }
            const response_data = JSON.parse(response.body);
            return response_data;
        })
        .catch((err) => {
            // console.log(err);
        });   
    
};

export const AddPCMdata = (data) => {


    return axiosPost(RESTAPI.ADDORUPDATEPCM, data)    
    .then((response) => {
        // console.log(response);        
        return response.statusCode;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const UploadDocument = (data) => {
    return axiosPost(RESTAPI.UPLOADPCMDOCUMENTS, data)    
    .then((response) => {        
        return response.statusCode;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const GetPCMDetails = (case_number) => {

    return axiosGet(RESTAPI.GETPCMDETAILS, {case_num:case_number})    
    .then((response) => {        
        const response_data = JSON.parse(response.body);
        return response_data;
    })
    .catch((err) => {
        // console.log(err);
    });
}

export const DeleteDocuments = (case_number, file_name) => {

    return axiosDelete(RESTAPI.DELETEDOCUMENTS + '/' + case_number + '/' + file_name)    
    .then((response) => {
        // console.log(response);
        return response.statusCode;
    })
    .catch((err) => {
        // console.log(err);
    });
} 