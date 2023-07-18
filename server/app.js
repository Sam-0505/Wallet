const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

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

//app.listen(3000);