import { Routes, Route } from "react-router-dom";

import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import RouteWrapper from "./Routes";

export default function AllRoutes(){
    return(
        <Routes>
            <Route  path="/" element={ <RouteWrapper loggedComponent={<Dashboard/>} defaultComponent={<SignIn/>}/>}/>
            <Route  path="/signup" element={ <RouteWrapper loggedComponent={<Dashboard/>} defaultComponent={<SignUp/>}/> }/>
            <Route  path="/dashboard" element={ <RouteWrapper loggedComponent={<Dashboard/>} defaultComponent={<Dashboard/>} isPrivate/> }/>
        </Routes>
    );
}