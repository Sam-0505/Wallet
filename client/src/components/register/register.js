import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [errors, setErrors] = useState({});

  const nav = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function checkPassStrength(inputtxt) {
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (inputtxt.match(passw)) {
      return true;
    } else {
      return false;
    }
  }

  const register = () => {
    const { name, email, password, reEnterPassword } = user;
    let err = {};

    if (!name) {
      err.name = "Please fill the name";
    }

    if (!email) {
      err.email = "Please fill the email";
    } else if (!isValidEmail(email)) {
      err.email = "Please give a valid email address";
    }

    if (!password) {
      err.pass = "Please fill the password";
    } else if (!checkPassStrength(password)) {
      err.pass =
        "Password should have 6-20 characters and atleast have a uppercase letter, a lower case letter and a numeric digit";
    }

    if (!reEnterPassword) {
      err.repass = "Please refill the password";
    } else if (password && password != reEnterPassword) {
      err.repass = "Password doesn't match";
    }
    setErrors(err);

    if (Object.keys(err).length === 0) {
      axios
        .post(
          "http://localhost:9002/register",
          { name, email, password },
          { withCredentials: true }
        )
        .then((res) => {
          alert(res.data);
          if (res.data == "You are registered") nav("/login");
        });
    }
  };

  const home = () => {
    nav("/");
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <input
        type="text"
        name="name"
        value={user.name}
        placeholder="Your Name"
        onChange={handleChange}
      ></input>
      {errors.name && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.name}</p>
      )}
      <input
        type="text"
        name="email"
        value={user.email}
        placeholder="Your Email"
        onChange={handleChange}
      ></input>
      {errors.email && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.email}</p>
      )}
      <input
        type="password"
        name="password"
        value={user.password}
        placeholder="Your Password"
        onChange={handleChange}
      ></input>
      {errors.pass && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.pass}</p>
      )}
      <input
        type="password"
        name="reEnterPassword"
        value={user.reEnterPassword}
        placeholder="Re-enter Password"
        onChange={handleChange}
      ></input>
      {errors.repass && (
        <p style={{ color: "red", fontSize: "13px" }}>{errors.repass}</p>
      )}
      <div className="button" onClick={register}>
        Register
      </div>
      <div>or</div>
      <div className="button" onClick={home}>
        Home
      </div>
    </div>
  );
};

export default Register;
