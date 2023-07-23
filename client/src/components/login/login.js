import React, {useState, useContext} from "react"
import "./login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../userContext";

const Login = ({ setLoginUser}) => {

    const {globUser, setGlobUser} = useContext(UserContext);

    const nav = useNavigate()

    const [ user, setUser] = useState({
        email:"",
        password:""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        axios.post("http://localhost:9002/login", user,{ withCredentials: true })
        .then(res => {
            console.log(res.data);
            setGlobUser(res.data);
            nav("/dashboard")
        })
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" ></input>
            <div className="button" onClick={login}>Login</div>
            <div>or</div>
            <div className="button">Register</div>
        </div>
    )
}

export default Login