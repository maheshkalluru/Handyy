import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Breadcrumb,
  Col,
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import { Home, Check } from "@material-ui/icons";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import {
  CalendarService,
  CalendarAddService,
  CalendarDeleteService,
  CalendarUpdateService,
} from "../../Services/calendar-service";
import Moment from "moment";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import Can from "../Can";
import rules from "../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from "../../Services/common-service";
import { RESTAPI } from "../../../rest-api";
import Axios from "axios";

const InitialCalendarData = {
  summary: "",
  end: "",
  start: "",
  categoryColor: "",
};
const colorCodes = {
  1: {
    background: "#a4bdfc",
    foreground: "#1d1d1d",
  },
  2: {
    background: "#7ae7bf",
    foreground: "#1d1d1d",
  },
  3: {
    background: "#dbadff",
    foreground: "#1d1d1d",
  },
  4: {
    background: "#ff887c",
    foreground: "#1d1d1d",
  },
  5: {
    background: "#fbd75b",
    foreground: "#1d1d1d",
  },
  6: {
    background: "#ffb878",
    foreground: "#1d1d1d",
  },
  7: {
    background: "#46d6db",
    foreground: "#1d1d1d",
  },
  8: {
    background: "#e1e1e1",
    foreground: "#1d1d1d",
  },
  9: {
    background: "#5484ed",
    foreground: "#1d1d1d",
  },
  10: {
    background: "#51b749",
    foreground: "#1d1d1d",
  },
  11: {
    background: "#dc2127",
    foreground: "#1d1d1d",
  },
};
let eventGoogleId;
let updateDateFormat;
let updateEndDateFormat;
let startCurrentDate;
let endCurrentDate;
const Calender = (props) => {
  let history = useHistory();
  let startDateEvent;
  let endDateEvent;
  let startDateTimeEvent;
  let endDateTimeEvent;
  let startTimeZoneEvent;
  let endTimeZoneEvent;
  const startDate = Moment().startOf("month").format("YYYY-MM-DDTHH:MM:SSZ");
  const endDate = Moment().endOf("month").format("YYYY-MM-DDTHH:MM:SSZ");
  const startDateWithTimezone = startDate.replace(" ", "+").replace("99", "00");
  const endDateWithTimezone = endDate.replace(" ", "+").replace("99", "00");
  let INITIAL_EVENTS = [];
  let inEv = [];
  const [events, setEvents] = useState(inEv);

  const calendarData = useCallback(getCalendarData, []);
  const userDetails = GetCurrentUser();
  const user_type = userDetails != null ? userDetails.user_type : "";

  // async function getCalendarData(fetchInfo, successCallback, failureCallback) {
  //   try {
  //     let startDate;
  //     let endDate;

  //     if (fetchInfo) {
  //       startDate = fetchInfo.startStr;
  //       endDate = fetchInfo.endStr;
  //     }
  //     if (startCurrentDate === startDate && endCurrentDate === endDate && false) {
  //       console.log("data present");
  //     } else {
  //       startCurrentDate = startDate;
  //       endCurrentDate = endDate;
  //       const userData = JSON.parse(localStorage.getItem("userData"));
  //       const accessToken = userData ? userData["custom:AccessToken"] : "";

  //       console.log("in get calendar data");

  //       const response = await Axios.get(
  //         RESTAPI.CALENDAR +
  //           "?orderBy=updated&singleEvents=true&timeMax=" +
  //           encodeURIComponent(endDate) +
  //           "&timeMin=" +
  //           encodeURIComponent(startDate),
  //         {
  //           headers: {
  //             Authorization: "Bearer " + accessToken,
  //           },
  //         }
  //       ).then((response) => {
  //         return response.data;
  //       });

  //       successCallback(
  //         response.items.map((event) => {
  //           let colorId = event.colorId != undefined ? event.colorId : "1";

  //           return {
  //             id: event.id,
  //             title: event.summary,
  //             start: event.start.dateTime,
  //             end: event.end.dateTime,
  //             color: colorCodes[colorId].background,
  //             display: "block",
  //             textColor: colorCodes[colorId].foreground,
  //           };
  //         })
  //       );

  //       failureCallback(console.log("in faiure",response))
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function getCalendarData(fetchInfo, successCallback, failureCallback) {
    let startDate;
    let endDate;

    if (fetchInfo) {
      startDate = fetchInfo.startStr;
      endDate = fetchInfo.endStr;
    }
    console.log("before api call");
    await CalendarService(startDate, endDate).then((response) => {
      successCallback(
        response.items.map((event) => {
          let colorId = event.colorId != undefined ? event.colorId : "1";

          return {
            id: event.id,
            title: event.summary,
            start: event.start.dateTime,
            end: event.end.dateTime,
            color: colorCodes[colorId].background,
            display: "block",
            textColor: colorCodes[colorId].foreground,
          };
        })
      );
    });
    console.log("after api call");
  }

  // useEffect(() => {
  //   calendarData();
  // }, [calendarData]);

  const [calendarState, setCalenderState] = useState({
    weekendsVisible: true,
    currentEvents: [],
  });

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: selectInfo.id,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {};

  const handleEvents = (events) => {
    setCalenderState({
      currentEvents: events,
    });
  };

  const [formData, updateFormData] = React.useState(InitialCalendarData);

  const handleInputChange = (event) => {
    updateFormData({
      ...formData,
      // Trimming any whitespace .trim()
      [event.target.name]: event.target.value,
    });
  };

  const handleaddEventShow = (event, forUpdate) => {
    eventGoogleId = event.event != undefined ? event.event.id : "";
    updateDateFormat = event.event != undefined ? event.event.start : "";
    updateEndDateFormat = event.event != undefined ? event.event.end : "";
    let backgroundColor =
      event.event != undefined ? event.event.backgroundColor : "";
    startDateEvent =
      event.event != undefined
        ? Moment(updateDateFormat).format("YYYY-MM-DD")
        : event.startStr;
    endDateEvent =
      event.event != undefined
        ? Moment(updateEndDateFormat).format("YYYY-MM-DD")
        : event.startStr;
    endDateEvent = event.endStr;
    updateFormData({
      ...formData,
      start: startDateEvent,
      end: endDateEvent,
    });

    setIsUpdate(forUpdate);
    setAddEventShow(true);
  };

  function getData() {
    if (!formData["start"].includes("T")) {
      formData["start"] = formData["start"] + "T00:00:00+05:30";
    }
    if (!formData["end"].includes("T")) {
      formData["end"] = formData["end"] + "T00:00:00+05:30";
    }
    let data = {
      summary: formData.summary,
      start: {
        // dateTime: formData["start"] + "T08:30:00+05:30",
        dateTime: formData["start"],
      },
      end: {
        // dateTime: formData["end"] + "T09:00:00+05:30",
        dateTime: formData["end"],
      },
      colorId: formData.categoryColor,
    };
    if (!data.colorId) {
      // This was not handled
      delete data.colorId;
    }
    CalendarAddService(data).then((response) => {
      // getCalendarData();
    });
    setAddEventShow(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getData();
  };

  const handleUpdateEvent = (event) => {
    let data = {
      // Edit event - why update start and end hardcoded?
      summary: formData.summary,
      start: {
        dateTime: updateDateFormat,
      },
      end: {
        dateTime: updateEndDateFormat,
      },
    };
    CalendarUpdateService(eventGoogleId, data).then((response) => {
      // getCalenderData();
    });
    setAddEventShow(false);
  };

  const handleDelete = (event) => {
    try {
      CalendarDeleteService(eventGoogleId).then((response) => {
        // getCalenderData();
      });
    } catch (err) {
      console.log(err);
    }
    setAddEventShow(false);
  };
  // on change color
  const onChangeColor = (event) => {
    formData.categoryColor = event.target.value;
  };
  // Modal states
  // Add New Category Modal States
  const [categoryShow, setCategoryShow] = useState(false);
  const handlecategoryClose = () => setCategoryShow(false);
  const handlecategoryShow = () => setCategoryShow(true);
  // Add New Event Modal States
  const [addEventShow, setAddEventShow] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const handleaddEventClose = () => setAddEventShow(false);

  return (
    <Can
      role={user_type}
      perform="calender:visit"
      yes={() => (
        <>
          <Container fluid style={{ paddingTop: "12px" }}>
            <Row className="item-flex-center m-0">
              <Row className="item-flex-start m-0">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <Home className="breadcrumb-home-icon"></Home>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active className="breadcrumb-active">
                    APPS
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active className="breadcrumb-active">
                    CALENDER
                  </Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="m-0">Calender</h1>
              </Row>
              <Button className="btn btn-success" onClick={handlecategoryShow}>
                New
              </Button>
            </Row>
          </Container>
          <Container fluid style={{ paddingTop: "18px" }}>
            <Row>
              <Col lg={12} className="p-0 mt-2">
                <div className="container-fluid page__container">
                  <div className="row">
                    <div className="col-lg-12 p-0">
                      <div className="card card-body">
                        <FullCalendar
                          // defaultView="timeGridWeek"
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            googleCalendarPlugin,
                          ]}
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                          }}
                          contentHeight="auto"
                          initialView="dayGridMonth"
                          editable={true}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          weekends={true}
                          select={(e) => handleaddEventShow(e, false)}
                          eventClick={(e) => handleaddEventShow(e, true)}
                          // events={events}
                          events={(
                            fetchInfo,
                            successCallback,
                            failureCallback
                          ) =>
                            getCalendarData(
                              fetchInfo,
                              successCallback,
                              failureCallback
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          {/* Add New Category Modal */}
          <Modal show={categoryShow} onHide={handlecategoryClose}>
            <Modal.Header closeButton className="border-bottom-0 pr-4 pl-4">
              <Modal.Title>Add a category</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 pr-4 pl-4">
              <form>
                <div className="form-group">
                  <label className="control-label">Category Name</label>
                  <input
                    className="form-control form-white"
                    placeholder="Enter name"
                    type="text"
                    name="category-name"
                  />
                </div>
                <div className="form-group">
                  <label className="control-label">Choose Category Color</label>
                  <select
                    className="form-control form-white"
                    data-placeholder="Choose a color..."
                    name="category-color"
                  >
                    <option value="primary">Primary</option>
                    <option value="success">Success</option>
                    <option value="danger">Danger</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer className="border-top-0 pb-4 pr-4">
              <Button
                variant="secondary"
                className="btn btn-light"
                onClick={handlecategoryClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="btn btn-primary ml-1 save-category"
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Add New Category Modal */}

          {/* Add New Event Modal */}
          <Modal
            show={addEventShow}
            onHide={handleaddEventClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="border-bottom-0 pr-4 pl-4">
              <Modal.Title>Add New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3 pr-4 pl-4">
              <form>
                {isUpdate ? (
                  <>
                    <label className="control-label">Change event name</label>
                    <InputGroup>
                      <FormControl
                        placeholder="Event Name"
                        style={{ borderRight: "transparent" }}
                        name="summary"
                        onChange={handleInputChange}
                      />
                      <InputGroup.Append>
                        <Button
                          className="btn btn-success"
                          onClick={handleUpdateEvent}
                        >
                          <Check
                            className="search-icon mr-2"
                            style={{ color: "white" }}
                          ></Check>{" "}
                          Save
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="control-label">Event Name</label>
                      <input
                        className="form-control form-white"
                        placeholder="Enter name"
                        type="text"
                        name="summary"
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div className="form-group">
                      <label className="control-label">Category</label>
                      <select
                        className="form-control form-white"
                        data-placeholder="Choose a color..."
                        name="categoryColor"
                        value={formData.categoryColor}
                        onChange={handleInputChange}
                      >
                        <option value="primary">Primary</option>
                        <option value="success">Success</option>
                        <option value="danger">Danger</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div> */}
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Example select</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={onChangeColor.bind(this)}
                      >
                        <option value="7">primary</option>
                        <option value="10">success</option>
                        <option value="3">danger</option>
                        <option value="2">info</option>
                        <option value="11">dark</option>
                      </Form.Control>
                    </Form.Group>
                  </>
                )}
              </form>
            </Modal.Body>
            <Modal.Footer className="border-top-0 pb-4 pr-4">
              <Button
                variant="secondary"
                className="btn btn-light"
                onClick={handleaddEventClose}
              >
                Close
              </Button>
              {isUpdate ? (
                <Button
                  variant="primary"
                  className="btn btn-danger ml-1 delete-event"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="btn btn-success ml-1 save-event"
                  onClick={handleSubmit}
                >
                  Create Event
                </Button>
              )}
            </Modal.Footer>
          </Modal>
          {/* Add New Event Modal */}
        </>
      )}
      no={() => <Redirect to={rules["default"][user_type]} />}
    />
  );
};

export default Calender;
