import { useState, useContext, useEffect } from "react";
import { UserContext } from "../userContext";
import axios from "axios"
import "./dashboard.css"
import { useNavigate } from "react-router-dom"
//import { set } from "mongoose";

export default function Dashboard(){
    const {globUser,setGlobUser} = useContext(UserContext);
    const [currBal, setCurrBal] = useState(globUser.balance);

    const nav = useNavigate();

    const [send, setSend] = useState({
        sendEmail:"",
        sendAmount:0
    })

    console.log(globUser);

    const handleChange = e =>{
        const { name, value } = e.target
        setSend({
            ...send,
            [name]: value
        })
    }

    function sendMoney()
    {
        axios.post("http://localhost:9002/sendMoney", {globUser, send},{ withCredentials: true })
        .then(res => {
            if(res.data=="Transaction Completed")
            {
                setCurrBal(currBal-send.sendAmount);
            }
            alert(res.data)
        })
    }

    function showTrans()
    {
        axios.post("http://localhost:9002/showTrans",{globUser},{ withCredentials: true })
        .then(res => {
            console.log(res.data)
        })
    }

    function logOut()
    {
        setGlobUser(null);
        nav('/');
    }

    return (<div className="dashboard">
        <h1>Dashboard</h1>
        {!! globUser && (<h2>Hi {globUser.name} !!</h2>)}
        {!! globUser && (<h2>Balance: {currBal} !!</h2>)}
        <input type="text" name="sendEmail" value={send.sendEmail} onChange={handleChange} placeholder="Enter Sender Email"></input>
        <input type="text" name="sendAmount" value={send.sendAmount} onChange={handleChange} placeholder="Enter Amount" ></input>
        <div className="button" onClick={sendMoney}>Send Money</div>
        <div className="button" onClick={showTrans}>Show Transactions</div>
        <div className="button" onClick={logOut}>Logout</div>
    </div>)
}