import React from "react"
import {Link} from 'react-router-dom'
import "./homepage.css"
import axios from "axios"

const Homepage = ({setLoginUser}) => {

    //axios.get("http://localhost:9002/", { withCredentials: true });

    return (
        <div className="homepage">
            <h1>DummyPe</h1>
            {/* <div className="button" onClick={() => setLoginUser({})} >Logout</div> */}
            <Link to="/login">
                <div className="button">Login</div>
            </Link>
            <Link to="/register">
                <div className="button">Register</div>
            </Link>
        </div>
    )
}

export default Homepage