import React from "react"
import {Link} from 'react-router-dom'
import "./homepage.css"

const Homepage = ({setLoginUser}) => {
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