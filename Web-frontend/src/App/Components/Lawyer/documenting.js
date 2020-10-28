import React from 'react';
import { Container, Row, Breadcrumb, Col } from 'react-bootstrap';
import { Home, Search, Close, DragHandle } from '@material-ui/icons';
import { Link } from "react-router-dom";

const Documenting = (props) => {
    return (
        <>
            <Container fluid style={{paddingTop: '12px'}}>
                <Row className="item-flex-center m-0">
                    <Row className="item-flex-start m-0">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">
                                <Home className="breadcrumb-home-icon"></Home>
                            </Breadcrumb.Item>                   
                            <Breadcrumb.Item active className="breadcrumb-active">DOCUMENTS</Breadcrumb.Item>                            
                        </Breadcrumb>
                        <h1 className="m-0">Documents</h1>
                    </Row>
                    <Link to="/" className="btn btn-success">New</Link>   
                </Row>            
            </Container>
            <Container fluid style={{paddingTop: '18px'}}>
                <Row>
                    <Col lg={12} className="p-0 mt-2">
                        <div class="container-fluid page__container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="row" data-toggle="dragula" data-dragula-containers='["#cards-moves-left", "#cards-moves-right"]' data-dragula-moves="js-dragula-handle">
                                        <div class="col-md">
                                            <div class="card shadow-none border bg-light">
                                                <div class="card-body">
                                                    <div class="text-label mb-3">
                                                        <div class="d-flex mb-3">
                                                            <div class="form-inline">
                                                                <div class="search-form search-form--light">
                                                                    <input type="text" class="form-control" placeholder="Search ..." id="searchSample03" />                                                                    
                                                                    <button class="btn" type="button">
                                                                        {/* <i class="material-icons">search</i> */}
                                                                        <Search className="search-icon" style={{color:'rgba(0, 0, 0, 0.4)'}}></Search>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="cards-moves-left" class="card-list">
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                    <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                        <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                        <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                    </g>
                                                                </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Document Title</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <DragHandle class="js-dragula-handle material-icons" style={{cursor: 'move', width: '24px'}}></DragHandle>                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                            <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                                <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Document Title</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <DragHandle class="js-dragula-handle material-icons" style={{cursor: 'move', width: '24px'}}></DragHandle>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                            <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                                <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Document Title</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <DragHandle class="js-dragula-handle material-icons" style={{cursor: 'move', width: '24px'}}></DragHandle>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                            <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                                <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Document Title</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <DragHandle class="js-dragula-handle material-icons" style={{cursor: 'move', width: '24px'}}></DragHandle>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md">
                                            <div class="card shadow-none border bg-light">
                                                <div class="card-body">
                                                    <div class="text-label mb-3">Freequently Downloaded Documents</div>
                                                    <div id="cards-moves-right" class="card-list">
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                            <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                                <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Partnership Agreements</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <button type="button" class="btn btn-danger">
                                                                        <Close style={{width: '18px'}}></Close>
                                                                        {/* <i class="material-icons">close</i> */}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card">
                                                            <div class="card-body media align-items-center">
                                                                <div class="media-left mr-3">
                                                                    <div class="avatar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                                                                            <g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                                                                <path d="M26.09 37.272l-7.424 1.06 1.06-7.424 19.092-19.092c1.758-1.758 4.606-1.758 6.364 0s1.758 4.606 0 6.364L26.09 37.272zM12 1.498h12c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5H12c-.828 0-1.5-.672-1.5-1.5v-3c0-.828.672-1.5 1.5-1.5zM25.5 4.498h6c1.656 0 3 1.344 3 3" stroke-width="3"></path>
                                                                                <path d="M34.5 37.498v6c0 1.656-1.344 3-3 3h-27c-1.656 0-3-1.344-3-3v-36c0-1.656 1.344-3 3-3h6M10.5 16.498h15M10.5 25.498h6" stroke-width="3"></path>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div class="media-body">
                                                                    <strong>Power of Attorney</strong><br />
                                                                    <span class="text-muted">Description Goes Here</span>
                                                                </div>
                                                                <div class="media-right ml-3">
                                                                    <button type="button" class="btn btn-danger">
                                                                        <Close style={{width: '18px'}}></Close>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
    );
}

export default Documenting;