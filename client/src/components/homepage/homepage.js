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
        console.log(val);

        axios.post("http://localhost:9002/auth", {token:val},{ withCredentials: true })
        .then(res => {
                console.log(res.data);
                nav('/login');
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