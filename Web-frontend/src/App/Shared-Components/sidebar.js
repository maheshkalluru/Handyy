import React from 'react';
import { Nav } from 'react-bootstrap';
import { Dvr } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const Sidebar = ({ toggleSidebar, isMobile }) => {
    return(        
        <>        
            <div className="sidebar-heading">Menu</div>
            <Nav defaultActiveKey="/home" className="flex-column custom-mb1">                    
                <Link to="/home" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Dashboard</span>
                </Link>                                
                <Link to="/calender" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Calendar</span>
                </Link>                
                <Link to="/pcm" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">PCM</span>
                </Link>                                     
                <Link to="/citation" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Citation</span>
                </Link>
                <Link to="/documenting" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>                
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Documenting</span>
                </Link>
                {isMobile 
                ? 
                <>
                <Link to="/edit-account" className="sidebar-menu-button" onClick={isMobile ? toggleSidebar : ''}>
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Account</span>
                </Link>
                <Link to="/" className="sidebar-menu-button" onClick={() => Auth.signOut()}>                 
                    <Dvr className="sidebar-menu-icon sidebar-menu-icon--left material-icons"></Dvr>
                    <span className="sidebar-menu-text">Logout</span>
                </Link>
                </>
                : ''
                }
            </Nav>
            <div className="sidebar-p-a">
                <Link to="/subscription" className="btn btn-primary handyy-primary-button" onClick={isMobile ? toggleSidebar : ''}>
                    Upgrade Your Account Now
                </Link>
            </div>        
        </>
    );
}

export default Sidebar;