import React from 'react';
import { Container, Row, Breadcrumb, Col } from 'react-bootstrap';
import { Home } from '@material-ui/icons';
import Can from "../Can";
import rules from "../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../Services/common-service';

const Subscription = (props) => {

    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    return <Can
        role={user_type}
        perform="subscription:visit"
        yes={() => (
            <>
            <Container fluid style={{paddingTop: '12px'}}>
                <Row className="item-flex-center m-0">
                    <Row className="item-flex-start m-0">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">
                                <Home className="breadcrumb-home-icon"></Home>
                            </Breadcrumb.Item>                   
                            <Breadcrumb.Item active className="breadcrumb-active">SUBSCRIPTION</Breadcrumb.Item>                            
                        </Breadcrumb>
                        <h1 className="m-0">Subscription</h1>
                    </Row>                      
                </Row>            
            </Container>
            <Container fluid style={{paddingTop: '18px'}}>
                <Row>
                    <Col lg={12} className="p-0 mt-2">
                        <div class="container-fluid page__container">
                            <div class="row card-group-row  pt-2">
                                <div class="col-md-6 col-lg-4 card-group-row__col">
                                    <div class="card card-group-row__card pricing__card">
                                        <div class="card-body d-flex flex-column">
                                            <div class="text-center">
                                                <h4 class="pricing__title mb-0">Freemium</h4>
                                                <div class="d-flex align-items-center justify-content-center border-bottom-2 flex pb-3">
                                                    <span class="pricing__amount headings-color">0</span>
                                                    <span class="d-flex flex-column">
                                                        <span class="pricing__currency text-dark-gray text-left">INR</span>
                                                        <span class="pricing__duration text-dark-gray">*30 Days</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="card-body d-flex flex-column">

                                                <ul class="list-unstyled pricing__features">

                                                    <li>30 Day Acesss</li>

                                                    <li>No Support</li>

                                                </ul>

                                                <a href="https://themeforest.net/item/stack-admin-bootstrap-4-dashboard-template/22959011" class="btn btn-success mt-auto">Start Trial Now</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6 col-lg-4 card-group-row__col">
                                    <div class="card card-group-row__card pricing__card pricing__card--popular">

                                        <span class="pricing__card-badge">most popular</span>

                                        <div class="card-body d-flex flex-column">
                                            <div class="text-center">
                                                <h4 class="pricing__title mb-0">Premium</h4>
                                                <div class="d-flex align-items-center justify-content-center border-bottom-2 flex pb-3">
                                                    <span class="pricing__amount headings-color">9999</span>
                                                    <span class="d-flex flex-column">
                                                        <span class="pricing__currency text-dark-gray text-left">INR</span>
                                                        <span class="pricing__duration text-dark-gray">*Yearly</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="card-body d-flex flex-column">

                                                <ul class="list-unstyled pricing__features">

                                                    <li>Unlimited Citation</li>

                                                    <li>Unlimited Documents</li>

                                                    <li>Unrestricted Access to PCM</li>

                                                    <li>6 Months Support</li>

                                                </ul>

                                                <a href="https://themeforest.net/item/stack-admin-bootstrap-4-dashboard-template/22959011" class="btn btn-primary mt-auto">Purchase Now</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
  />; 

}

export default Subscription;