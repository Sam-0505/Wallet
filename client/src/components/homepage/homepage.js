import React, {useState, useContext} from "react"
import {Link} from 'react-router-dom'
import "./homepage.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "../userContext";

const Homepage = ({setLoginUser}) => {

    const {globUser, setGlobUser} = useContext(UserContext);

    //axios.get("http://localhost:9002/", { withCredentials: true });
    const nav = useNavigate();

    function logNav(){

        const val =localStorage.getItem('token');
        //console.log(val);

        axios.post("http://localhost:9002/auth", {token:val},{ withCredentials: true })
        .then(res => {
            if(res.data!="Invalid Token" && res.data!="A token is required for authentication")
            {
                setGlobUser(res.data);
                nav("/dashboard")
            }
            else{
                nav("/login");
            }
        });
    }

    return (
        <div className="homepage">
            <h1>DummyPe</h1>
            <div className="button" onClick={logNav}>Login</div>
            <Link to="/register">
                <div className="button">Register</div>
            </Link>
        </div>
    )
}

export default Homepage