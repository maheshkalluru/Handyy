import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Breadcrumb, Button, FormControl, InputGroup } from 'react-bootstrap';
import { Home } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { GetPCMLists } from '../../../Services/pcm-service';
import Moment from 'moment';
import { GetCurrentUserAdvocateId, setCurrentCaseNumber } from '../../../Services/common-service';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Can from "../../Can";
import rules from "../../../../rbac-rules";
import { Redirect } from "react-router-dom";
import { GetCurrentUser } from '../../../Services/common-service';

const { SearchBar } = Search;

const PCMList = (props) =>{

    const advocate_id = GetCurrentUserAdvocateId();
    const [pcmLists, setPcmLists] = useState([]);
    const columns = [{
            dataField: 'case_num',
            text: 'Case Number',
            formatter: caseNumberFormatter,
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => {                  
                  setCurrentCaseNumber(row.case_num);                
                }
            }
        }, {
            dataField: 'case_details.case_type',
            text: 'Case Type'            
        }, {
            dataField: 'party[0].name',
            text: 'Party Name',                       
        },
        {
            dataField: 'party[0].phone',
            text: 'Party Mobile',            
        },
        {
            dataField: 'case_details.court_name',
            text: 'Court Name',            
        },
        {
            dataField: 'case_details.registration_date',
            text: 'Reg. Date',  
            formatter: dateFormatter          
        },
        {
            dataField: 'case_details.adjourn_date',
            text: 'Adjourn Date',
            formatter: dateFormatter            
        },
        {
            dataField: 'case_details.case_model',
            text: 'Update',
            formatter: UpdateButtonFormatter,
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => {                  
                  setCurrentCaseNumber(row.case_num);                
                }
            }
        }
    ];
    const userDetails = GetCurrentUser();
    const user_type = userDetails != null ? userDetails.user_type : "";

    const options = {        
        hideSizePerPage: true, // > You can hide the dropdown for sizePerPage
        alwaysShowAllBtns: true, // Always show next and previous button                
    };

    function caseNumberFormatter(cell, row) {        
        return (
            <Link to="/pcm-new"><span className="js-lists-values-employee-name">{cell}</span></Link>
        );
    }

    function UpdateButtonFormatter(cell, row) {        
        return (
            <Link to="/pcm-new" className="btn btn-sm btn-primary dz-clickable">Update</Link>
        );
    }

    function dateFormatter(cell, row){
        return (
            Moment(cell).format("DD/MM/YYYY")   
        );
    }

    const pcmListData = useCallback(() => {
        GetPCMLists().then(data => {
            if(data.cases) setPcmLists(data.cases);
        });
    }, [])

    useEffect(() => {
        pcmListData()              
    }, [pcmListData]);    

    return <Can
        role={user_type}
        perform="pcm:list"
        yes={() => (
            <>
                <Container fluid style={{paddingTop: '12px'}}>
                    <Row className="item-flex-center m-0">
                        <Row className="item-flex-start m-0">
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">
                                    <Home className="breadcrumb-home-icon"></Home>
                                </Breadcrumb.Item>                   
                                <Breadcrumb.Item active className="breadcrumb-active">PCM</Breadcrumb.Item>
                            </Breadcrumb>
                            <h1 className="m-0">PCM</h1>
                        </Row>                    
                        <Link to="/pcm-new" className="btn btn-success">New Case</Link>                    
                    </Row>            
                </Container>
                <Container fluid style={{paddingTop: '18px'}}>
                    <Row>
                        <Col lg={12} className="mt-2">                                              
                            <div className="container-fluid page__container">
                                <div className="row">
                                    <div className="col-lg-12 p-0">
                                        <div className="card card-form">
                                            <div className="row no-gutters">                                    
                                                <div className="col-lg-12 card-form__body">
                                                    <div className="table-responsive border-bottom" data-toggle="lists" data-lists-values='["js-lists-values-employee-name"]'>                    

                                                        <div style={{overflow:'auto'}}>
                                                            <ToolkitProvider keyField="case_num" data={ pcmLists } columns={ columns } search >
                                                                {
                                                                    props => (
                                                                        <div>                       
                                                                            <SearchBar { ...props.searchProps } />
                                                                            <hr />
                                                                            <BootstrapTable { ...props.baseProps }  bordered={ false } pagination={ paginationFactory(options)} noDataIndication="No data"/>
                                                                        </div>
                                                                    )
                                                                }
                                                            </ToolkitProvider>
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
        )}
        no={() => <Redirect to={rules["default"][user_type]} />}
  />; 
}

export default PCMList;