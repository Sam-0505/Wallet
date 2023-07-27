import React, { useState, useContext } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

const Login = ({ setLoginUser }) => {
  const { globUser, setGlobUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});

  const nav = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    let err = {};

    if (!user.email) {
      err.email = "Please fill the email";
    }

    if (!user.password) {
      err.pass = "Please fill the password";
    }

    setErrors(err);

    if (Object.keys(err).length === 0) {
      axios
        .post("http://localhost:9002/login", user, { withCredentials: true })
        .then((res) => {
          if (res.status == 200) {
            setGlobUser(res.data.userData);
            localStorage.setItem("token", JSON.stringify(res.data.userToken));
            nav("/dashboard");
          } else {
            alert(res.data.userData);
          }
        })
        .catch((err) => {
          setErrors({ pass: err.response.data });
        });
    }
  };

  const home = () => {
    nav("/");
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <input
        type="text"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter your Email"
      ></input>
      {errors.email && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.email}</p>
      )}
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter your Password"
      ></input>
      {errors.pass && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.pass}</p>
      )}
      <div className="button" onClick={login}>
        Login
      </div>
      <div>or</div>
      <div className="button" onClick={home}>
        Home
      </div>
    </div>
  );
};

export default Login;
