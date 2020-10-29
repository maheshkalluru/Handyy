import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from './App/Components/Authentication/Login';
import Dashboard from "../src/App/Components/Lawyer/dashboard";
import AdminDashboard from "./App/Components/Admin/admin-dashboard"
import PCMList from "./App/Components/Lawyer/PCM/pcm-lists";
import EditPCM from "./App/Components/Lawyer/PCM/add-edit-pcm";
import Account from './App/Components/Lawyer/account';
import Citation from "./App/Components/Lawyer/citation";
import Documenting from "./App/Components/Lawyer/documenting";
import Calender from "./App/Components/Lawyer/calender";
import Subscription from "./App/Components/Lawyer/subscription";
import NotFound from './App/Shared-Components/not-found';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Routes = (props) => {

    // const userHomePages = {
    //     "administrator": AdminDashboard,
    //     "advocate": Dashboard,
    //     "support": AdminDashboard,
    //     "" : Login
    // };

    // const userDetails = GetCurrentUser();
    // const user_type = userDetails != null ? userDetails.user_type : "";

    // if(userStr!==undefined){
    //     const userDetails = JSON.parse(userStr);
    //     console.log(userDetails);
    //     if(userDetails.user_type!==undefined){
    //         user_type = userDetails.user_type;
    //     }
    // }
    // console.log(user_type);

    return (
        <>
            <Switch>
                {/* <Route path="/" component={userHomePages[user_type]} /> */}
                <Route exact path="/home" component={Dashboard} />
                <Route exact path="/calender" component={Calender} />
                <Route exact path="/pcm" component={PCMList} />               
                <Route exact path="/pcm-new" component={EditPCM} />
                <Route exact path="/citation" component={Citation} />
                <Route exact path="/documenting" component={Documenting} />
                <Route exact path="/subscription" component={Subscription} />
                <Route exact path="/edit-account" component={Account} />                                    
                <Route exact path="/admin-dashboard" component={AdminDashboard} /> 
                <Route component={NotFound} />
            </Switch>
            <ToastContainer />
        </>
    );
};

export default Routes;
