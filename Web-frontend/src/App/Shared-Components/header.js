import React from "react";
import {
  Container,
  Navbar,
  Form,
  FormControl,
  Button,
  Image,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import logo from "../assets/images/logo.png";
import DefaultUser from "../assets/images/avatar/demi.png";

import {
  Search,
  Notifications,
  Dvr,
  Edit,
  ExitToApp,
} from "@material-ui/icons";
import { Auth } from "aws-amplify";
import { notifySuccess } from "../Services/toaster-service";

const Header = ({ toggleSidebar }) => {
    const localuserData = JSON.parse(localStorage.getItem("userData"));
    const user = localuserData != undefined ? JSON.parse(localStorage.getItem("userData")) : null;
    const logout = () => {
        notifySuccess('Logged Out!');
        localStorage.clear();
        Auth.signOut();
    }

  return (
    <Navbar
      expand="sm"
      variant="dark"
      bg="dark"
      fixed="top"
      className="handyy-header"
    >
      <Container fluid>
        <Navbar.Brand href="/" className="">
          <Image src={logo} style={{ maxHeight: "40px" }} />
        </Navbar.Brand>
        <Navbar.Toggle
          className="navbar-toggler-right d-block d-md-none"
          aria-controls="basic-navbar-nav"
          onClick={toggleSidebar}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="d-sm-flex flex">
          <Form
            inline
            className="search-form d-none d-sm-flex flex handyy-search-form"
          >
            <InputGroup style={{ width: "100%" }}>
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  className="handy-search-btn"
                >
                  <Search className="search-icon"></Search>
                </Button>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2 handyy-searchbar"
              />
            </InputGroup>
          </Form>
        </Navbar.Collapse>
        <ul className="nav navbar-nav ml-auto d-none d-md-flex">
          <li className="nav-item dropdown">
            <a
              href="#notifications_menu"
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              data-caret="false"
            >
              <Notifications className="material-icons nav-icon navbar-notifications-indicator"></Notifications>
            </a>
            <div
              id="notifications_menu"
              className="dropdown-menu dropdown-menu-right navbar-notifications-menu"
            >
              <div className="dropdown-item d-flex align-items-center py-2">
                <span className="flex navbar-notifications-menu__title m-0">
                  Notifications
                </span>
                <a href="#" className="text-muted">
                  <small>Clear all</small>
                </a>
              </div>
              <div
                className="navbar-notifications-menu__content"
                data-perfect-scrollbar
              >
                <div className="py-2">
                  <div className="dropdown-item d-flex">
                    <div className="mr-3">
                      <div
                        className="avatar avatar-sm"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <img
                          src="assets/images/256_daniel-gaffey-1060698-unsplash.jpg"
                          alt="Avatar"
                          className="avatar-img rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <a href="">Adv. Rahul C</a> left a comment on
                      <a href=""></a>
                      <br />
                      <small className="text-muted">1 minute ago</small>
                    </div>
                  </div>
                  <div className="dropdown-item d-flex">
                    <div className="mr-3">
                      <div
                        className="avatar avatar-sm"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <img
                          src="assets/images/256_daniel-gaffey-1060698-unsplash.jpg"
                          alt="Avatar"
                          className="avatar-img rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <a href="">Adv. Rahul C</a> left a comment on
                      <a href=""></a>
                      <br />
                      <small className="text-muted">1 minute ago</small>
                    </div>
                  </div>
                  <div className="dropdown-item d-flex">
                    <div className="mr-3">
                      <div
                        className="avatar avatar-sm"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <img
                          src="assets/images/256_daniel-gaffey-1060698-unsplash.jpg"
                          alt="Avatar"
                          className="avatar-img rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <a href="">Adv. Rahul C</a> left a comment on
                      <a href=""></a>
                      <br />
                      <small className="text-muted">1 minute ago</small>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="#"
                className="dropdown-item text-center navbar-notifications-menu__footer"
              >
                View All
              </a>
            </div>
          </li>
        </ul>
        <Dropdown
          className="d-none d-sm-flex dd-right navbar-height align-items-center"
          style={{ borderLeft: "1px solid rgba(0, 0, 0, 0.34)" }}
        >
          <Dropdown.Toggle
            id="dropdown-basic"
            className="navDropdown e-caret-hide"
          >
            <span className="mr-2 d-flex-inline">
              <span className="text-light">                
                {user
                  ? user.given_name + " " + user["family_name"][0] + "."
                  : "User"}
              </span>
            </span>
            <img
              src={user ? user.picture: DefaultUser}
              className="rounded-circle"
              width="32"
              alt="Frontted"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu id="dropdownMenu">
            <div className="dropdown-item-text dropdown-item-text--lh">
              <strong>{user ? user.name: 'User'}</strong> <br />
              <span className="text-muted">{user ? user.email : 'Demo User'}</span>
            </div>            
            <Dropdown.Divider />
            <Dropdown.Item href="/subscription" className="dropdown-item">
              <Dvr className="material-icons" id="navBarIcons" />
              Subscription
            </Dropdown.Item>
            <Dropdown.Item href="/edit-account" className="dropdown-item">
              <Edit className="material-icons" id="navBarIcons" />
              Edit account
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/" onClick={() => Auth.signOut()}>
              <ExitToApp className="material-icons" id="navBarIcons" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};
export default Header;
