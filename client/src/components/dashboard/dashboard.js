import { useState, useContext, useEffect} from "react";
import { UserContext } from "../userContext";
import axios from "axios"
import "./dashboard.css"
import { useNavigate } from "react-router-dom"

export default function Dashboard(){
    const {globUser,setGlobUser} = useContext(UserContext);
    const [currBal, setCurrBal] = useState(globUser.balance);
    const [transData, setTransData] = useState([]);
    const [collectionData, setCollectionData] = useState([]);

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

    const filterTrans = (e) =>{
        var limit = e.target.value;
        const result = transData.filter(trans => trans.amount>limit);
        setCollectionData(result);
    }

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
        <select onChange={filterTrans}>
            <option value="50">Greater than 50</option>
            <option value="30">Greater than 30</option>
            <option value="10">Greater than 10</option>
            <option value="0">All transactions</option>
        </select>
        <table>
            <thead>
            <tr>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {collectionData.map((item, index) => (
                <tr key={index}>
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