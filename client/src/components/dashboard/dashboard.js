import { useState, useContext, useEffect} from "react";
import { UserContext } from "../userContext";
import axios from "axios"
import "./dashboard.css"
import { useNavigate } from "react-router-dom"

export default function Dashboard(){
    const {globUser,setGlobUser} = useContext(UserContext);
    const [currBal, setCurrBal] = useState(globUser.balance);
    const [transData, setTransData] = useState([]);

    const [limit, setLimit] = useState(0);
    const [direc, setDirec] = useState(0);
    const [collectionData, setCollectionData] = useState([]);

    const nav = useNavigate();

    const [send, setSend] = useState({
        sendEmail:"",
        sendAmount:0
    })

    //console.log(globUser);

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
            if(res.data==="Transaction Completed")
            {
                setCurrBal(currBal-send.sendAmount);
            }
            alert(res.data)
        })
    }

    useEffect(()=>{
        axios.post("http://localhost:9002/showTrans",{globUser},{ withCredentials: true })
        .then(res => {
            setTransData(res.data);
            setCollectionData(res.data)
        })
    },[globUser,currBal]);

    function logOut()
    {
        setGlobUser(null);
        nav('/');
    }

    function getDay(date)
    {
        return date.split('T')[0];
    }

    function getTime(date)
    {
        var slots = date.split('T')[1].split('.')[0].split(':');
        var min = Number(slots[1])+30;
        var hour = Number(slots[0])+5+parseInt(min/60);
        min = min%60;

        return ""+hour+":"+min+":"+slots[2];
    }

    const filterAmount = (e) =>{
        var limit = e.target.value;
        setLimit(limit);
        const result = transData.filter(trans => trans.amount>limit);
        setCollectionData(result);
    }

    const filterDirection=(e)=>{
        var pt = e.target.value;
        setDirec(pt);
    }

    useEffect(()=>{
        var res;

        if(direc==0)
        {
            res=transData;
        }
        else if(direc==1)
        {
            res = transData.filter(trans=>trans.source==globUser.email);
        }
        else
        {
            res = transData.filter(trans=>trans.destination==globUser.email);
        }

        setCollectionData(res.filter(trans=>trans.amount>limit))
    },[limit,direc]);

    return (<div className="dashboard">
        <h1>Dashboard</h1>
        {!! globUser && (<h2>Hi {globUser.name} !!</h2>)}
        {!! globUser && (<h2>Balance: {currBal} !!</h2>)}
        <input type="text" name="sendEmail" value={send.sendEmail} onChange={handleChange} placeholder="Enter Sender Email"></input>
        <input type="text" name="sendAmount" value={send.sendAmount} onChange={handleChange} placeholder="Enter Amount" ></input>
        <div className="button" onClick={sendMoney}>Send Money</div>
        {/* <div className="button" onClick={showTrans}>Show Transactions</div> */}
        <div>
        <h1>Transaction Data</h1>
            {"FILTERS: "}
            {"Transaction type: "}
            <select onChange={filterDirection}>
                <option value="0">All transactions</option>
                <option value="-1">Recevied</option>
                <option value="1">Sent</option>
            </select>
            {" Amount: "}
            <select onChange={filterAmount}>
                <option value="0">All transactions</option>
                <option value="50">Greater than 50</option>
                <option value="30">Greater than 30</option>
                <option value="10">Greater than 10</option>
            </select>
            <table cellPadding="5" cellSpacing="5">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {collectionData.map((item, index) => (
                    <tr key={index}>
                    <td>{getDay(item.createdAt)}</td>
                    <td>{getTime(item.createdAt)}</td>
                    <td>{item.source}</td>
                    <td>{item.destination}</td>
                    <td>{item.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="button" onClick={logOut}>Logout</div>
    </div>)
}