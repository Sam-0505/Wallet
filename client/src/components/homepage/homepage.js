import React from "react"
import {Link} from 'react-router-dom'
import "./homepage.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Homepage = ({setLoginUser}) => {

    //axios.get("http://localhost:9002/", { withCredentials: true });
    const nav = useNavigate();

    function logNav(){
        nav('/login');
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