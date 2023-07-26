import React, { useState } from "react"
import "./register.css"
import { useNavigate } from "react-router-dom"
import axios from 'axios';

const Register = () => {

    const nav = useNavigate()

    const [ user, setUser] = useState({
        name: "",
        email:"",
        password:"",
        reEnterPassword: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    function isValidEmail(email) {
        
        return /\S+@\S+\.\S+/.test(email);
    }

    function checkPassStrength(inputtxt) 
    { 
        var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if(inputtxt.match(passw)) 
        { 
            return true;
        }
        else
        {
            return false;
        }
    }

    const register = () => {
        const { name, email, password, reEnterPassword } = user

        if( name && password && password && reEnterPassword){

            if(!isValidEmail(email))
            {
                return alert("Please give a valid email address");
            }

            if(password != reEnterPassword)
            {
                return alert("Passwords don't match");
            }

            if(!checkPassStrength(password))
            {
                return alert("Password should have 6-20 characters and atleast have a uppercase letter, a lower case letter and a numeric digit")
            }


            axios.post("http://localhost:9002/register", {name,email,password},{ withCredentials: true })
            .then( res => {
                alert(res.data)
                if(res.data == "You are registered")
                    nav("/login");
            })
        } else {
            alert("Please fill all the details")
        }
    }

    const home = ()=>{
        nav("/");
    }

    return (
        <div className="register">
            {/* {console.log("User", user)} */}
            <h1>Register</h1>
            <input type="text" name="name" value={user.name} placeholder="Your Name" onChange={ handleChange }></input>
            <input type="text" name="email" value={user.email} placeholder="Your Email" onChange={ handleChange }></input>
            <input type="password" name="password" value={user.password} placeholder="Your Password" onChange={ handleChange }></input>
            <input type="password" name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={ handleChange }></input>
            <div className="button" onClick={register} >Register</div>
            <div>or</div>
            <div className="button" onClick={home}>Home</div>
        </div>
    )
}

export default Register