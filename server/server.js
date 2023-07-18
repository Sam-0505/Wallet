const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const jwt = require("json-web-token")

const userModel = require("./models/userModel")
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.URI)
    .then(()=>{
        console.log("Connected successfully");
        app.listen(process.env.PORT || 8000,(err)=>{
            if(err)console.log(err);
            console.log(`running at port ${process.env.PORT}`);
        })
    })
    .catch((error)=>console.log("Failed to connect",error));

app.get("/",(req,res)=>{
    res.send("api running");
});

app.post("/register",(req,res)=>{
    userModel.create(req.body)
    .then(UserData => res.json(UserData))
    .catch(err=>res.json(err))
})