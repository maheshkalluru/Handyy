import React, { useState, useEffect, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import {
  Home,
  AccountCircle,
  Today,
  // Search,
  FirstPage,
  ChevronRight,
  ChevronLeft,
  LastPage,
  MoreVert,
} from "@material-ui/icons";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import Flatpickr from "react-flatpickr";
import { Link } from "react-router-dom";

import Moment from "moment";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import {
  GetAdvocateLists,
  UpdateAdvocateData,
} from "../../Services/admin-service";
import Can from "../Can";
import rules from "../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../Services/common-service';
import { notifySuccess } from '../../Services/toaster-service';

const { SearchBar } = Search;

const AdminDashboard = (props) => {
  const userDetails = GetCurrentUser();
  const user_type = userDetails != null ? userDetails.user_type : "";
  let subscriptionType;
  const [advocateLists, setAdvocateList] = useState([]);

  const dataPickerOptions = {
    mode: "range",
    dateFormat: "Y-m-d",
    defaultDate: [
      Moment().startOf("month").format("YYYY-MM-DD"),
      Moment().endOf("month").format("YYYY-MM-DD"),
    ],
  };

  const options = {
    hideSizePerPage: true, // > You can hide the dropdown for sizePerPage
    alwaysShowAllBtns: true, // Always show next and previous button
  };
  const columns = [
    {
      dataField: "email",
      text: "User Name/Email ID",
      style: {
        width: '53%'
      }
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter
    },
    {
      dataField: "subscription_type",
      text: "Subscription type",
      formatter: typeFormatter,
    },
    {
      dataField: "last_activity",
      text: "Last Activity",
      formatter: lastActivityFormatter,
    },
    {
      dataField: "registration_date",
      text: "Joined Date",
      formatter: registrationDateFormatter,
    },
    {
      dataField: "id",
      text: "",
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          updateAdvocate(row);
        },
      },
      formatter: UpdateButtonFormatter,
    },
  ];

  function statusFormatter(cell){
      return (
        <span className="badge badge-warning">{cell}</span> 
      )
  }

  function typeFormatter(cell) {
    return (
      <Form inline>
        <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
        </Form.Label>
        <Form.Control
          as="select"
          className="my-1 mr-sm-2"
          id="inlineFormCustomSelectPref"
          custom
          onChange={onValueChange}
          defaultValue = {cell}
        >
          <option value="Premium">Premium</option>
          <option value="Freemium">Freemium</option>
          <option value="Basic">Basic</option>
        </Form.Control>
        </Form>
      // <Form.Group controlId="exampleForm.ControlSelect1">
      //   <Form.Control as="select" onChange={onValueChange} inputref = {cell}>
      //     <option value="Premium">Premium</option>
      //     <option value="Freemium">Freemium</option>
      //   </Form.Control>
      // </Form.Group>
    );
  }

  function UpdateButtonFormatter(cell, row) {
    return (
      <button className="btn btn-sm btn-primary dz-clickable">Update</button>
    );
  }

  function updateAdvocate(row) {
    // console.log("in update", row.id,subscriptionType);
    let data = {
      id: row.id,
      subscription_type: subscriptionType,
    };
    UpdateAdvocateData(data).then((data) => {
      // console.log(data);
      notifySuccess('Updated!')
      getAdvocateInfo();
    });
  }

  function lastActivityFormatter(cell, row) {
    return <small className="text-muted">{cell}</small>;
  }

    function lastActivityFormatter(cell, row) {
        return <small className="text-muted">{cell}</small>;
    }

    function registrationDateFormatter(cell, row) {
        return Moment(cell).format("DD/MM/YYYY");
    }

  const advocateListData = useCallback(getAdvocateInfo, []);

  function getAdvocateInfo(){
    GetAdvocateLists().then((data) => {
    //   console.log(data);
      if (data) setAdvocateList(data);
    });
  }

  useEffect(() => {
    // console.log("inside use effect...");
    advocateListData();
  }, [advocateListData]);

  const dateChange = (date) => {
    GetAdvocateLists().then((data) => {
    //   console.log(data);
      if (data) setAdvocateList(data);
    });
  };

  const onValueChange = (event) => {
    subscriptionType = event.target.value;
  };
  
    // return (
      
    // );

    return <Can
        role={user_type}
        perform="admin-dashboard:visit"
        yes={() => (
          <>
          <div className="mdk-header-layout__content">
            <div
              className="mdk-drawer-layout js-mdk-drawer-layout"
              data-push
              data-responsive-width="992px"
            >
              <div className="mdk-drawer-layout__content page">
                <div className="container-fluid page__heading-container">
                  <div className="page__heading d-flex align-items-center">
                    <div className="flex">
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                          <li className="breadcrumb-item">
                            <a href="#">
                              <Home className="material-icons icon-20pt" />
                            </a>
                          </li>
                          <li className="breadcrumb-item">Dashboard</li>
                        </ol>
                      </nav>
                      <h1 className="m-0">Dashboard</h1>
                    </div>
                  </div>
                </div>

                <div className="container-fluid page__container">
                  <div className="row card-group-row">
                    <div className="col-xl-3 col-md-6 card-group-row__col">
                      <div className="card card-group-row__card card-body flex-row align-items-center">
                        <div className="position-relative mr-2">
                          <div className="text-center fullbleed d-flex align-items-center justify-content-center flex-column z-0">
                            <h3 className="text-danger mb-0">12%</h3>
                            <small className="text-uppercase">Today</small>
                          </div>
                          <canvas
                            width="90"
                            height="90"
                            className="position-relative z-1"
                            data-toggle="progress-chart"
                            data-progress-chart-value="12"
                            data-progress-chart-color="danger"
                            data-progress-chart-tone="300"
                          ></canvas>
                        </div>
                        <div className="flex">
                          <div className="text-amount">&#36;1,020</div>
                          <div className="text-muted mt-1">Total Sales</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 card-group-row__col">
                      <div className="card card-group-row__card card-body flex-row align-items-center">
                        <div className="position-relative mr-2">
                          <div className="text-center fullbleed d-flex align-items-center justify-content-center flex-column z-0">
                            <h3 className="text-success mb-0">68%</h3>
                            <small className="text-uppercase">Month</small>
                          </div>
                          <canvas
                            width="90"
                            height="90"
                            className="position-relative z-1"
                            data-toggle="progress-chart"
                            data-progress-chart-value="68"
                            data-progress-chart-color="success"
                            data-progress-chart-tone="400"
                          ></canvas>
                        </div>
                        <div className="flex">
                          <div className="text-amount">&#36;6,670</div>
                          <div className="text-muted mt-1">
                            Sales for this month
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 card-group-row__col">
                      <div className="card card-group-row__card card-body flex-row align-items-center">
                        <div>
                          <AccountCircle className="material-icons text-primary icon-48pt mr-2" />
                        </div>
                        <div className="flex">
                          <div className="text-amount">37</div>
                          <div className="text-muted mt-1">
                            No of Subscriptions
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6 card-group-row__col">
                      <div className="card card-group-row__card card-body flex-row align-items-center">
                        <div>
                          <AccountCircle className="material-icons text-primary icon-48pt mr-2" />
                        </div>
                        <div className="flex">
                          <div className="text-amount">87%</div>
                          <div className="text-muted mt-1">
                            Sign-Up Percentage
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="ml-auto">
                      <div className="d-flex flatpickr-calendar-right">
                        <Flatpickr
                          options={dataPickerOptions}
                          onChange={dateChange}
                          style={{ color: "#1f69c1", background: 'transparent' }}
                        />
                        <label for="" className="ml-1 text-muted">
                          <Today className="material-icons icon-18pt" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card card-form">
                    <div className="row no-gutters">
                      <div className="col-lg-12 card-form__body">
                        <div
                          className="table-responsive border-bottom"
                          data-toggle="lists"
                          data-lists-values='["js-lists-values-employee-name"]'
                        >
                          <div style={{ overflow: "auto" }}>
                            {/* <input
                              type="text"
                              className="form-control search"
                              placeholder="Search"
                            />
                            <button className="btn" type="button"> */}
                            {/* <Search className="material-icons" /> */}
                            {/* </button> */}
                            <ToolkitProvider
                              keyField="email"
                              data={advocateLists}
                              columns={columns}
                              search
                            >
                              {(props) => (
                                <div>
                                  <SearchBar {...props.searchProps} />
                                  <hr />
                                  <BootstrapTable
                                    {...props.baseProps}
                                    bordered={false}
                                    pagination={paginationFactory(options)}
                                    noDataIndication="No data"
                                  />
                                </div>
                              )}
                            </ToolkitProvider>
                          </div>

                          {/* <table className="table mb-0 thead-border-top-0">
                            <thead>
                              <tr>
                                <th>User Name/Email ID</th>

                                <th style={{ width: "37px" }}>Status</th>
                                <th style={{ width: "180px" }}>
                                  Subscription Type
                                </th>
                                <th style={{ width: "120px" }}>Last Activity</th>
                                <th style={{ width: "51px" }}>Joined Date</th>
                                <th style={{ width: "24px" }}></th>
                              </tr>
                            </thead>
                            <tbody className="list" id="staff02">
                              <tr>
                                <td>
                                  <span className="js-lists-values-employee-name">
                                    test@gmail.com
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-warning">
                                    Active
                                  </span>
                                </td>
                                <td>
                                  <select
                                    id="country"
                                    className="custom-select"
                                    style={{ width: "auto" }}
                                  >
                                    <option value="usa">Freemium</option>
                                  </select>
                                </td>
                                <td>
                                  <small className="text-muted">3 days ago</small>
                                </td>
                                <td>13/03/2020</td>
                                <td>
                                  <button className="btn btn-sm btn-primary dz-clickable">
                                    Update
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span className="js-lists-values-employee-name">
                                    test@gmail.com
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-warning">
                                    Inactive
                                  </span>
                                </td>
                                <td>
                                  <select
                                    id="country"
                                    className="custom-select"
                                    style={{ width: "auto" }}
                                  >
                                    <option value="usa">Premium</option>
                                  </select>
                                </td>
                                <td>
                                  <small className="text-muted">3 days ago</small>
                                </td>
                                <td>13/03/2020</td>
                                <td>
                                  <button className="btn btn-sm btn-primary dz-clickable">
                                    Update
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span className="js-lists-values-employee-name">
                                    test@gmail.com
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-warning">
                                    Active
                                  </span>
                                </td>
                                <td>
                                  <select
                                    id="country"
                                    className="custom-select"
                                    style={{ width: "auto" }}
                                  >
                                    <option value="usa">Freemium</option>
                                  </select>
                                </td>
                                <td>
                                  <small className="text-muted">3 days ago</small>
                                </td>
                                <td>13/03/2020</td>
                                <td>
                                  <button className="btn btn-sm btn-primary dz-clickable">
                                    Update
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*<div className="mt-4">
                    <ul className="pagination justify-content-end">
                      <li className="page-item disabled">
                        <a className="page-link" href="#" aria-label="Previous">
                          <FirstPage
                            aria-hidden="true"
                            className="material-icons"
                          />
                          <span className="sr-only">First</span>
                        </a>
                      </li>

                      <li className="page-item disabled">
                        <a className="page-link" href="#" aria-label="Previous">
                          <ChevronLeft
                            aria-hidden="true"
                            className="material-icons"
                          />
                          <span className="sr-only">Prev</span>
                        </a>
                      </li>

                      <li className="page-item active">
                        <a className="page-link" href="#" aria-label="1">
                          <span>1</span>
                        </a>
                      </li>

                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="2">
                          <span>2</span>
                        </a>
                      </li>

                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="3">
                          <span>3</span>
                        </a>
                      </li>

                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                          <span className="sr-only">Next</span>
                          <ChevronRight
                            aria-hidden="true"
                            className="material-icons"
                          />
                        </a>
                      </li>

                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                          <span className="sr-only">Last</span>
                          <LastPage
                            aria-hidden="true"
                            className="material-icons"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
  />; 

  // return <Can
  //       role={user_type}
  //       perform="dashboard:visit"
  //       yes={() => (
          
  //       )}
  //       no={() => <Redirect to={rules["default"][user_type]} />}
  // />; 

};

export default AdminDashboard;
