import { RESTAPI } from "../../rest-api";
import { axiosGet, axiosPost } from "./http-request-service";

const GetAdvocateLists = () => {
  return axiosGet(RESTAPI.GETADMINADVOCATELIST)
    .then((response) => {
    //   console.log("in admin service", JSON.parse(response.body));
      const response_data = JSON.parse(response.body);
      return response_data;
    })
    .catch((err) => {
    //   console.log(err);
    });
};

const UpdateAdvocateData = (data) => {
  return axiosPost(RESTAPI.UPDATEADVOCATEDATA, data)
    .then((response) => {
    //   console.log("in admin service", JSON.parse(response.body));
      const response_data = JSON.parse(response.body);
      return response_data;
    })
    .catch((err) => {
    //   console.log(err);
    });
};

export { GetAdvocateLists, UpdateAdvocateData };
