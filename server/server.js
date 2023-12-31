const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const bcrypt = require("bcryptjs")
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');

const userModel = require("./models/userModel");
const userData = require("./models/userModel");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin: "http://localhost:3000"
}));
app.use(cookieParser());

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

app.post("/register",async (req,res)=>{

    try{
        const { name, email, password} = req.body;

        // Validate user input
        if (!(email && password && name)) {
        return res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await userModel.findOne({ email });

        if (oldUser) {
        return res.status(400).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({name : name, email : email, password: encryptedPassword})
        .then(UserData => res.json(UserData))
        .catch(err=>res.json(err));

        // const token = await jwt.sign(
        //     {user_id: user._id, email },
        //     process.env.TOKEN_KEY,
        //     {
        //     expiresIn: "2h",
        //     }
        // );

        // user.token = token;

        // return new user
        res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
    }
})

app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await userModel.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, name:user.name,email},
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          },
          (err, token)=>{
            if(err)
              throw err;
            res.cookie('token',token).json(user);
          }
        );
        // // save user token
        // user.token = token;
  
        // user
        //res.status(200).json(user);
    }else{
      res.json("Invalid Credentials");
    } 
  }
    catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

app.get("/profile",(req,res)=>{
  const {token}=req.cookies;

  if(token)
  {
    jwt.verify(token,process.env.TOKEN_KEY,{
      expiresIn: "2h",
    },(err,user)=>{
      if(err)
        throw err;
      res.json(user);
    });
  }
  else{
    res.json("Profile is not updated");
  }
})