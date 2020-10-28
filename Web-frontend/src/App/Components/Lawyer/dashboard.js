import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Breadcrumb, Button, Carousel } from "react-bootstrap";
import { Home, MoreVert, Today } from "@material-ui/icons";
import { GetPCMLists } from "../../Services/pcm-service";
import { Link } from "react-router-dom";
import Moment from "moment";
import { GetCurrentUserAdvocateId } from "../../Services/common-service";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import Can from "../Can";
import rules from "../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../Services/common-service';

const { SearchBar } = Search;

const Dashboard = () => {
  const userDetails = GetCurrentUser();
  const user_type = userDetails != null ? userDetails.user_type : "";
  const dataPickerOptions = {
    mode: "range",
    dateFormat: "Y-m-d",
    defaultDate: [
      Moment().startOf("month").format("YYYY-MM-DD"),
      Moment().endOf("month").format("YYYY-MM-DD"),
    ],
  };
  const [pcmLists, setPcmLists] = useState([]);
  const advocate_id = GetCurrentUserAdvocateId();
  const columns = [
    {
      dataField: "case_num",
      text: "Case Number",
      style: {
        width: '60%'
      }
    },
    {
      dataField: "last_activity",
      text: "Last Activity",
      formatter: lastActivityFormatter,
    },
    {
      dataField: "case_details.registration_date",
      text: "Date",
      formatter: registrationDateFormatter,
    },
    {
      dataField: "case_details.adjourn_date",
      text: "",
      formatter: moreVertOption,
    },
  ];

  const options = {
    hideSizePerPage: true, // > You can hide the dropdown for sizePerPage
    alwaysShowAllBtns: true, // Always show next and previous button
  };

  function moreVertOption(cell, row) {
    return (
      <a className="text-muted">
        <MoreVert className="material-icons"></MoreVert>
      </a>
    );
  }

  function lastActivityFormatter(cell, row) {
    return <small className="text-muted">{cell}</small>;
  }

  function registrationDateFormatter(cell, row) {
    return Moment(cell).format("DD/MM/YYYY");
  }

  const pcmListData = useCallback(() => {
    GetPCMLists().then((data) => {
    //   console.log(data);
      if (data.cases) setPcmLists(data.cases);
    });
  }, []);

  useEffect(() => {    
    pcmListData();
  }, [pcmListData]);

  const dateChange = (date) => {
    // console.log(date);
    const start_date = Moment(date[0]).format("YYYY-MM-DD");
    const end_date = Moment(date[1]).format("YYYY-MM-DD");
    GetPCMLists(start_date, end_date).then((data) => {
    //   console.log(data);
      if (data.cases) setPcmLists(data.cases);
    });
  };

  // const listItems = pcmLists.map((item, i) => (
  //   <tr key={i}>
  //     <td>
  //       <span className="js-lists-values-employee-name">{item.case_num}</span>
  //     </td>
  //     {/* <td><span className="badge badge-warning">Status 1</span></td> */}
  //     <td>
  //       <small className="text-muted">{item.last_activity}</small>
  //     </td>
  //     <td>
  //       {Moment(item.case_details.registration_date).format("DD/MM/YYYY")}
  //     </td>
  //     <td>
  //       <a href="" className="text-muted">
  //         <MoreVert className="material-icons"></MoreVert>
  //       </a>
  //     </td>
  //   </tr>
  // ));

  return <Can
        role={user_type}
        perform="dashboard:visit"
        yes={() => (
          <Container fluid style={{ paddingTop: "12px" }}>
            <Row className="item-flex-center m-0">
              <Row className="item-flex-start m-0">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">
                    <Home className="breadcrumb-home-icon"></Home>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active className="breadcrumb-active">
                    Dashboard
                  </Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="m-0">Dashboard</h1>
              </Row>
              <Link to="/pcm-new" className="btn btn-success">
                New Case
              </Link>
              <div className="container-fluid page__container p-0">
                <div
                  className="d-flex align-items-center"
                  style={{ justifyContent: "flex-end" }}
                >
                  <Flatpickr
                    options={dataPickerOptions}
                    onChange={dateChange}
                    style={{ color: "#1f69c1" }}
                  />
                  <label className="text-muted">
                    <Today></Today>
                  </label>
                </div>

                <div className="card card-form">
                  <div className="row no-gutters">
                    <div className="col-lg-12 card-form__body">
                      <div
                        className="table-responsive border-bottom"
                        data-toggle="lists"
                        data-lists-values='["js-lists-values-employee-name"]'
                      >
                        {/* <div className="search-form search-form--light m-3">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search"
                            onChange={filterTable}
                          />
                          <button className="btn" type="button">
                            <Search className="material-icons"></Search>
                          </button>
                        </div> */}

                        {/* <table className="table mb-0 thead-border-top-0">
                          <thead>
                            <tr>
                              <th>Case Number</th>

                              <th style={{ width: "37px" }}>Status</th>
                              <th style={{ width: "120px" }}>Last Activity</th>
                              <th style={{ width: "51px" }}>Date</th>
                              <th style={{ width: "24px" }}></th>
                            </tr>
                          </thead>
                          <tbody className="list" id="staff02">
                            {listItems}
                          </tbody>
                        </table> */}
                        <div style={{ overflow: "auto" }}>
                          <ToolkitProvider
                            keyField="case_num"
                            data={pcmLists}
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* imade slider */}
                <div className="mb-4">
                  <Carousel>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require("../../assets/images/posts/fabian-irsara-92113.jpg")}
                        alt="First slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require("../../assets/images/posts/fabian-irsara-92113.jpg")}
                        alt="Third slide"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={require("../../assets/images/posts/fabian-irsara-92113.jpg")}
                        alt="Third slide"
                      />
                    </Carousel.Item>
                  </Carousel>
                </div>
              </div>
            </Row>
          </Container>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
  />;

};

export default Dashboard;
