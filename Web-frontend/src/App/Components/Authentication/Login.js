import React, { useEffect, useState } from "react";
import { AuthContext } from "../../../App";
import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "../../../aws-exports";
import LoginService from "../../Services/login-service"
import { GetCurrentUser } from '../../Services/common-service';
import { useHistory } from "react-router-dom";
import { notifySuccess, notifyError } from '../../Services/toaster-service';

Amplify.configure(awsconfig);

const Login = (props) => {

    const currentUser = GetCurrentUser();

    const { dispatch } = React.useContext(AuthContext);
    const [data, setData] = React.useState("");
    let history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                case "cognitoHostedUI":
                    // console.log('sign in and cognito event...');
                    // getUser().then((userData) => {
                    //     console.log('1 dispatch...');
                    //     dispatch({
                    //         type: "LOGIN",
                    //         payload: userData,
                    //     });
                    //     setUser(userData);
                    // }); 
                    break;
                case "signOut":
                    // console.log('sign out event...');
                    dispatch({
                        type: "LOGOUT",
                        payload: null
                    })
                    setUser(null);
                    break;
                case "signIn_failure":
                case "cognitoHostedUI_failure":
                    console.log("Sign in failure", data);
                    break;
                default:
                    // console.log('idhr to aayega hi');
                    break;
            }
        });    
        
        getUser().then((userData) => {
            // console.log('1');
            if(userData){
                // console.log('1 dispatch...');
                dispatch({
                    type: "LOGIN",
                    payload: userData
                })
            }else{
                dispatch({
                    type: "LOGOUT",
                    payload: null
                })
            } 
             
            setUser(userData ? userData : null)
        });
    }, []);

    function getUser() {
        return Auth.currentAuthenticatedUser()
        .then((userData) => {            
            const x = JSON.parse(
            atob(userData.signInUserSession.idToken.jwtToken.split(".")[1])
            );            
            localStorage.setItem('userData',JSON.stringify(x));
            if(!currentUser){                
                // LoginService()  
                LoginService().then(response => {
                    notifySuccess('Successfully logged in!');
                    localStorage.setItem('handyyUser',JSON.stringify(response));
                    localStorage.setItem('currentActiveItems',JSON.stringify({ccn: ""}));
                    if(response && response.user_type != "advocate"){
                      history.push('/admin-dashboard');
                    }
                    else{
                      if(response && response.isRegistered) history.push("/home")
                      else history.push('/edit-account');
                    }
                    
                })
                .catch((error) => notifyError("Invalid Credentials!"));
            }
            return userData;
        })
        .catch(() => console.log("Not signed in"));
    }

  return (
    <div className="layout-login-centered-boxed full-height">
      <div
        className="layout-login-centered-boxed__form card"
        style={{
          padding: "0px",
          minHeight: "200px",
          border: "none",
          borderRadius: "6px",
          background: "none",
        }}
      >
        <div className="col-md-12 clearfix" style={{ padding: "0px" }}>
          <div
            className="col-sm-6 clearfix"
            style={{
              float: "left",
              padding: "10px",
              background: "rgba(0, 24, 110, 1)",
              minHeight: "200px",
              borderRadius: "6px 0px 0px 6px",
            }}
          >
            <p>
              <img
                src={require("../../assets/images/logo-login.png")}
                style={{ maxWidth: "229px", textAlign: "center" }}
              />
            </p>
          </div>
          <div
            className="col-sm-6 clearfix"
            style={{
              float: "left",
              padding: "10px",
              background: "rgba(197, 0, 23, 0.9)",
              minHeight: "200px",
              borderRadius: "0px 6px 6px 0px",
            }}
          >
            <p className="col-md-12">
              <br />
              <br />
              <span
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Glad to see you here!
              </span>
            </p>
            <br />
            {user ? (
              <button
                className="btn btn-light btn-block"
                onClick={() => Auth.signOut()}
              >
                <span className="fab fa-google mr-2"></span>
                Sign Out {user.getUsername()}
              </button>
            ) : (
              <button
                className="btn btn-light btn-block"
                onClick={() => Auth.federatedSignIn({ provider: "Google" })}
              >
                <span className="fab fa-google mr-2"></span>
                Continue with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;