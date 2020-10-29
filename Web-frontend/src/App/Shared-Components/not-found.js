import React from 'react';
import { Container, Row, Breadcrumb} from 'react-bootstrap';
import { Home } from '@material-ui/icons';

const NotFound = () => {
    return (
        <Container fluid style={{paddingTop: '12px'}}>
            <Row className="item-flex-center m-0">
                <Row className="item-flex-start m-0">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">
                            <Home className="breadcrumb-home-icon"></Home>
                        </Breadcrumb.Item>                   
                        <Breadcrumb.Item active className="breadcrumb-active">404</Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 className="m-0">Request page not found!</h1>
                </Row>                                                      
            </Row>            
        </Container>
    );
}

export default NotFound;