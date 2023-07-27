import { useState, useContext, useEffect } from "react";
import { UserContext } from "../userContext";
import axios from "axios";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { globUser, setGlobUser } = useContext(UserContext);
  const [currBal, setCurrBal] = useState(globUser.balance);
  const [sug, setSug] = useState([]);
  const [transData, setTransData] = useState([]);

  const [limit, setLimit] = useState(0);
  const [direc, setDirec] = useState(0);
  const [sortPar, setSortPar] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [collectionData, setCollectionData] = useState([]);

  const nav = useNavigate();

  const [errors, setErrors] = useState({});

  const [send, setSend] = useState({
    sendEmail: "",
    sendAmount: 0,
  });

  var j = document.getElementsByName("sendEmail");
  if (j.length) {
    j[0].addEventListener("focusout", (event) => {
      setSug([]);
    });
  }

  //console.log(globUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSend({
      ...send,
      [name]: value,
    });
  };

  useEffect(() => {
    var res = [];
    for (var i = 0; i < transData.length; i++) {
      if (
        transData[i].destination != globUser.email &&
        res.indexOf(transData[i].destination) == -1 &&
        transData[i].destination.startsWith(send.sendEmail) &&
        res.length < 5 &&
        transData[i].destination != send.sendEmail
      ) {
        res.push(transData[i].destination);
      }
    }

    setSug(res);
  }, [send]);

  function sendMoney() {
    //console.log(sug);
    let err = {};

    if (!send.sendEmail) {
      err.email = "Please fill the email";
    }

    if (!send.sendAmount) {
      err.money = "Please fill the amount";
    }

    setErrors(err);
    if (Object.keys(err).length === 0) {
      axios
        .post(
          "http://localhost:9002/sendMoney",
          { globUser, send },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            setCurrBal(currBal - send.sendAmount);
            alert(res.data);
          }
        })
        .catch((err) => {
          setErrors({ email: err.response.data });
        });
    }
  }

  useEffect(() => {
    axios
      .post(
        "http://localhost:9002/showTrans",
        { globUser },
        { withCredentials: true }
      )
      .then((res) => {
        setTransData(res.data);
        setCollectionData(res.data);
      });
  }, [globUser, currBal]);

  function logOut() {
    setGlobUser(null);
    localStorage.clear();
    nav("/");
  }

  function getDay(date) {
    return date.split("T")[0];
  }

  function getTime(date) {
    var slots = date.split("T")[1].split(".")[0].split(":");
    var min = Number(slots[1]) + 30;
    var hour = Number(slots[0]) + 5 + parseInt(min / 60);
    min = min % 60;

    return "" + hour + ":" + min + ":" + slots[2];
  }

  useEffect(() => {
    var res;

    if (direc == 0) {
      res = transData;
    } else if (direc == 1) {
      res = transData.filter((trans) => trans.source == globUser.email);
    } else {
      res = transData.filter((trans) => trans.destination == globUser.email);
    }

    res = res.filter((trans) => trans.amount > limit);

    if (Number(sortPar) == 1) {
      console.log(sortPar);
      res = res.sort(function (a, b) {
        return (a.amount - b.amount) * sortOrder;
      });
    } else {
      if (sortOrder == -1) res = res.reverse();
    }

    setCollectionData(res);
  }, [limit, direc, sortPar, sortOrder]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {!!globUser && <h2>Hi {globUser.name} !!</h2>}
      {!!globUser && <h2>Balance: {currBal} !!</h2>}
      <input
        type="text"
        name="sendEmail"
        value={send.sendEmail}
        onChange={handleChange}
        placeholder="Enter Sender Email"
      ></input>
      {sug.length != 0 && (
        <div className="dropdown">
          {sug.map((item, index) => (
            <div
              className="dropdown-row"
              key={index}
              onClick={(e) =>
                setSend({ ...send, sendEmail: e.target.textContent })
              }
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {errors.email && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.email}</p>
      )}
      <input
        type="text"
        name="sendAmount"
        value={send.sendAmount}
        onChange={handleChange}
        placeholder="Enter Amount"
      ></input>
      {errors.money && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.money}</p>
      )}
      <div className="button" onClick={sendMoney}>
        Send Money
      </div>
      {/* <div className="button" onClick={showTrans}>Show Transactions</div> */}
      <div>
        <h1>Transaction Data</h1>
        {"FILTER BY: "}
        {"Transaction type: "}
        <select onChange={(e) => setDirec(e.target.value)}>
          <option value="0">All transactions</option>
          <option value="-1">Recevied</option>
          <option value="1">Sent</option>
        </select>
        {" Amount: "}
        <select onChange={(e) => setLimit(e.target.value)}>
          <option value="0">All transactions</option>
          <option value="50">Greater than 50</option>
          <option value="30">Greater than 30</option>
          <option value="10">Greater than 10</option>
        </select>
        <p>
          SORT BY:{" "}
          <select onChange={(e) => setSortPar(e.target.value)}>
            <option value="0">Date</option>
            <option value="1">Amount</option>
          </select>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="1">Ascending</option>
            <option value="-1">Descending</option>
          </select>
        </p>
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
      <div className="button" onClick={logOut}>
        Logout
      </div>
    </div>
  );
}
