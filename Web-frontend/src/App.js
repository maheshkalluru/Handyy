import React, { useState } from "react";
import "./App.css";
import Header from "./App/Shared-Components/header";
import Sidebar from "./App/Shared-Components/sidebar";
import { Container, Row, Col } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import Routes from "./routes";
import Login from "./App/Components/Authentication/Login";
// import AdminDashboard from "./App/Components/Admin/AdminDashboard";
import { useLocation } from 'react-router-dom';

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
    //   console.log("login action milla...", action);     
      return {
        ...state,
        isAuthenticated: true,        
      };
    case "LOGOUT":
    // console.log("logout action milla...", action);     
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,        
      };
    default:
      return state;
  }
};

const App = () => {

  let location = useLocation();
  let showSidebar = true;
  let history = useHistory();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [isCollapse, setCollapse] = useState(false);

  const handlerCollapse = () => setCollapse(!isCollapse);

  const toggleSidebar = () => {
    handlerCollapse();
    // console.log("toggling...");
  };

  let redirectSet = false;
  let redirectVal = "/";
  if(location.pathname === "/"){
      redirectSet = true;
      let handyyUser = localStorage.getItem("handyyUser");
      try{
        if(state.isAuthenticated && handyyUser !== undefined){
          handyyUser = JSON.parse(handyyUser);
          if(handyyUser.user_type === "advocate"){
            redirectVal = "/home";
            showSidebar = true;
          }
          else{
            redirectVal = "/admin-dashboard";
            showSidebar = false;
          } 
        }
      }
      catch{
        redirectVal = "/";
      }

  }
  
  
  if(location.pathname !== "/"){
    let handyyUser = localStorage.getItem("handyyUser");
    handyyUser = JSON.parse(handyyUser);
    try{
        if(state.isAuthenticated && handyyUser !== undefined && handyyUser.user_type !== "advocate"){
            showSidebar = false
        }else{
            showSidebar = true;
        }
    }catch{
        showSidebar = true;
    }
  }

  return (
        <AuthContext.Provider value={{ state, dispatch }}>
            <div className="App full-height">
                {
                !state.isAuthenticated ? (
                    <Login></Login>
                ) : redirectSet ? (
                  <Redirect to={redirectVal} />
                ) : !showSidebar ? (
                <>
                <Header toggleSidebar={toggleSidebar}></Header>
                        <Container fluid className="handyy-container-background">
                            <Row>
                        <Col className="col-without-sidebar">
                                    <Routes></Routes>
                        </Col>
                         </Row>
                        </Container>
                    </>
                ) : (
                    <>
                        <Header toggleSidebar={toggleSidebar}></Header>
                        <Container fluid className="handyy-container">
                            <Row>
                                <Col md={3} lg={3} className="sidebar-custom-col-3">
                                    <div id="handyy-sidebar" className={`handyy-sidebar ${isCollapse ? "has-drawer-opened" : ""}`}>
                                        <Sidebar toggleSidebar={toggleSidebar} isMobile={isCollapse}></Sidebar>
                                    </div>
                                </Col>
                                <div style = {{display: "none"}} className={`mdk-drawer__scrim ${isCollapse ? "mdk-drawer__scrim_opacity" : ""}`}></div>
                                <Col sm = {12} md={9} lg={9} className="handyy-custom-main-col">
                                    <Routes></Routes>
                                </Col>
                            </Row>
                        </Container>
                    </>
                )}
            </div>
        </AuthContext.Provider>
    );
};

export default App;