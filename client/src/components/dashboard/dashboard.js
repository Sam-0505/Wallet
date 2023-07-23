import { useState, useContext } from "react";
import { UserContext } from "../userContext";
import axios from "axios"
import "./dashboard.css"

export default function Dashboard(){
    const user = useContext(UserContext)

    const [send, setSend] = useState({
        sendEmail:"",
        sendAmount:0
    })

    console.log(user);

    const handleChange = e =>{
        const { name, value } = e.target
        setSend({
            ...send,
            [name]: value
        })
    }

    function sendMoney()
    {
        axios.post("http://localhost:9002/sendMoney", {user, send},{ withCredentials: true })
        .then(res => {
            alert(res.data)
        })
    }

    function showTrans()
    {
        axios.post("http://localhost:9002/showTrans",{user},{ withCredentials: true })
        .then(res => {
            console.log(res.data)
        })
    }

    return (<div className="dashboard">
        <h1>Dashboard</h1>
        {!! user && (<h2>Hi {user.name} !!</h2>)}
        {!! user && (<h2>Balance: {user.balance} !!</h2>)}
        <input type="text" name="sendEmail" value={send.sendEmail} onChange={handleChange} placeholder="Enter Sender Email"></input>
        <input type="text" name="sendAmount" value={send.sendAmount} onChange={handleChange} placeholder="Enter Amount" ></input>
        <div className="button" onClick={sendMoney}>Send Money</div>
        <div className="button" onClick={showTrans}>Show Transactions</div>
    </div>)
}