import Axios from "axios";
import { RESTAPI } from "../../rest-api";
import { Auth} from "aws-amplify";

const CalendarService = (startDate, endDate) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData ? userData["custom:AccessToken"] : "";
  return (
    Axios.get(
      RESTAPI.CALENDAR +
        "?orderBy=updated&singleEvents=true&timeMax=" +
        encodeURIComponent(endDate) +
        "&timeMin=" +
        encodeURIComponent(startDate),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
      // .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        return response.data;
      })
      .catch((err) => {
        console.log("in api call catch")
        Auth.signOut();
        return Promise.reject(err);
      })
  );
};

const CalendarAddService = (data) => {
//   console.log("CalendarAddService", data);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData ? userData["custom:AccessToken"] : "";
//   console.log(accessToken);
  return fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((response) => {
    //   console.log(response);
      // const response_data = JSON.parse(response.body);
      return response.statusCode;
    })
    .catch((err) => {
      Auth.signOut();
    //   console.log(err);
    });
};

const CalendarUpdateService = (eventId, data) => {
//   console.log("CalendarAddService", eventId, data);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData ? userData["custom:AccessToken"] : "";
  return fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events/" +
      eventId,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((response) => {
    //   console.log(response);
      // const response_data = JSON.parse(response.body);
      return response.statusCode;
    })
    .catch((err) => {
      Auth.signOut();
    //   console.log(err);
    });
};

const CalendarDeleteService = (data) => {
//   console.log("CalendarAddService", data);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData ? userData["custom:AccessToken"] : "";
//   console.log(accessToken);
  return fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + data,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((response) => {
    //   console.log(response);
      return response.statusCode;
    })
    .catch((err) => {
    //   console.log(err);
    });
};

export {
  CalendarService,
  CalendarAddService,
  CalendarDeleteService,
  CalendarUpdateService,
};
