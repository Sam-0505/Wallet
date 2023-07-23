import React from "react"
import {Link} from 'react-router-dom'
import "./homepage.css"
import axios from "axios"

const Homepage = ({setLoginUser}) => {

    //axios.get("http://localhost:9002/", { withCredentials: true });

    return (
        <div className="homepage">
            <h1>Hello Homepage</h1>
            {/* <div className="button" onClick={() => setLoginUser({})} >Logout</div> */}
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
    )
}

export default Homepage