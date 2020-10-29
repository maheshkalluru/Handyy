import React from 'react';
import { Container, Row, Breadcrumb, Col, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Home, Search, ArrowForward } from '@material-ui/icons';
import Can from "../Can";
import rules from "../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../Services/common-service';

const Citation = (props) => {

    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    // return (
       
    // );

    return <Can
        role={user_type}
        perform="citation:visit"
        yes={() => (
           <>
                <Container fluid style={{paddingTop: '12px'}}>
                    <Row className="item-flex-center m-0">
                        <Row className="item-flex-start m-0">
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">
                                    <Home className="breadcrumb-home-icon"></Home>
                                </Breadcrumb.Item>                   
                                <Breadcrumb.Item className="breadcrumb-active">CITATION</Breadcrumb.Item>
                                <Breadcrumb.Item active className="breadcrumb-active">PAGE</Breadcrumb.Item>
                            </Breadcrumb>
                            <h1 className="m-0">Citation</h1>
                        </Row>                       
                    </Row>            
                </Container>
                <Container fluid style={{paddingTop: '18px'}}>
                    <Row>
                        <Col lg={12} className="p-0 mt-2">
                            <div class="container-fluid page__container">
                                <div class="row">                            
                                    <div class="col-md-12">
                                        <div class="d-flex mb-3">
                                            <div class="form-inline">
                                                <div class="search-form search-form--light">
                                                    {/* <input type="text" class="form-control" placeholder="Search ..." id="searchSample03" />
                                                    <button class="btn" type="button">
                                                        <Search className="search-icon" style={{color:'rgba(0, 0, 0, 0.4)'}}></Search>
                                                    </button> */}
                                                    <InputGroup>
                                                        <FormControl placeholder="Search..." style={{borderRight: 'transparent', backgroundColor: '#FAFBFE'}} />
                                                        <InputGroup.Append>
                                                            <Button variant="outline-secondary" className="pcm-search">
                                                                <Search className="search-icon" style={{color:'rgba(0, 0, 0, 0.4)'}}></Search>
                                                            </Button>
                                                        </InputGroup.Append>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <div class="ml-auto d-flex">
                                                <div class="form-group form-inline mb-0">
                                                    <label for="sort" class="mr-2">Sort by</label>
                                                    <select class="form-control" id="sort">
                                                        <option value="">Newest</option>
                                                        <option value="">Oldest</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="stories-cards mb-4">
                                            <div class="card">
                                                <div class="d-flex align-items-center flex-wrap">
                                                    <div class="m-4">
                                                        <a href="#" class="d-flex align-items-center text-muted">                                                    
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                    <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                </g>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                    <div class="stories-card__title flex">
                                                        <h5 class="card-title m-0"><a href="" class="text-body">Citation Title Goes Here</a></h5>
                                                        <small class="text-muted">Short Description Goes Here...</small>
                                                    </div>
                                                    <div class="ml-auto d-flex align-items-center">
                                                        
                                                        <div class="badge badge-soft-vuejs badge-pill mr-3">CT-001</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="card">
                                                <div class="d-flex align-items-center flex-wrap">
                                                    <div class="m-4">
                                                        <a href="#" class="d-flex align-items-center text-muted">                                                    
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                    <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                </g>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                    <div class="stories-card__title flex">
                                                        <h5 class="card-title m-0"><a href="" class="text-body">Citation Title Goes Here</a></h5>
                                                        <small class="text-muted">Short Description Goes Here...</small>
                                                    </div>
                                                    <div class="ml-auto d-flex align-items-center">
                                                        
                                                        <div class="badge badge-soft-vuejs badge-pill mr-3">CT-002</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="card">
                                                <div class="d-flex align-items-center flex-wrap">
                                                    <div class="m-4">
                                                        <a href="#" class="d-flex align-items-center text-muted">                                                    
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                    <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                </g>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                    <div class="stories-card__title flex">
                                                        <h5 class="card-title m-0"><a href="" class="text-body">Citation Title Goes Here</a></h5>
                                                        <small class="text-muted">Short Description Goes Here...</small>
                                                    </div>
                                                    <div class="ml-auto d-flex align-items-center">
                                                        
                                                        <div class="badge badge-soft-vuejs badge-pill mr-3">CT-003</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center mb-3">
                                            <div class="form-inline">
                                                View
                                                <select class="custom-select ml-2">
                                                    <option value="20" selected>20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                    <option value="200">200</option>
                                                </select>
                                            </div>
                                            <div class="ml-auto">
                                                20 <span class="text-muted">of 100</span> <a href="#" class="icon-muted">
                                                    <ArrowForward className="float-right"></ArrowForward>
                                                    {/* <i class="material-icons float-right">arrow_forward</i> */}
                                                </a>
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

export default Citation;