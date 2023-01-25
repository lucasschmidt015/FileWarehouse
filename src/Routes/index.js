import { Routes, Route } from "react-router-dom";
import SignIn from "../Pages/SignIn";

export default function AllRoutes(){
    return(
        <Routes>
            <Route  path="/" element={ <SignIn/> }/>
        </Routes>
    );
}