import { useState, useContext } from "react";
import { UserContext } from "../userContext";
import axios from "axios"
import "./dashboard.css"

export default function Dashboard(){
    const {globUser,setGlobUser} = useContext(UserContext);

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

    return (<div className="dashboard">
        <h1>Dashboard</h1>
        {!! globUser && (<h2>Hi {globUser.name} !!</h2>)}
        {!! globUser && (<h2>Balance: {globUser.balance} !!</h2>)}
        <input type="text" name="sendEmail" value={send.sendEmail} onChange={handleChange} placeholder="Enter Sender Email"></input>
        <input type="text" name="sendAmount" value={send.sendAmount} onChange={handleChange} placeholder="Enter Amount" ></input>
        <div className="button" onClick={sendMoney}>Send Money</div>
        <div className="button" onClick={showTrans}>Show Transactions</div>
    </div>)
}