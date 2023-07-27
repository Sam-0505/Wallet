const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

const userModel = require("./models/userModel");
const transModel = require("./models/transModel");
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Connected successfully");
    app.listen(process.env.PORT || 8000, (err) => {
      if (err) console.log(err);
      console.log(`running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Failed to connect", error));

app.get("/", (req, res) => {
  res.clearCookie("token");
  res.send("api running");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const user = await userModel
      .create({
        name: name,
        email: email,
        password: encryptedPassword,
        balance: 1000,
      })
      .then((UserData) => res.status(200).json("You are registered!!"))
      .catch((err) => res.json(err));
  } catch (err) {
    res.status(400).json(err);
  }
});

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(JSON.parse(token), process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    req.user = decoded;
  } catch (err) {
    return res.send("Invalid Token");
  }
  return next();
};

app.post("/auth", verifyToken, async (req, res) => {
  const x = req.user;
  const title = await userModel.findOne({ email: req.user.email });
  res.status(200).send(title);
});

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
        { user_id: user._id, name: user.name, email: email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        },
        (err, newToken) => {
          if (err) throw err;
          res.status(200).json({ userData: user, userToken: newToken });
        }
      );
    } else {
      res.status(400).json("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/sendMoney", async (req, res) => {
  //res.json("Hello");
  try {
    const { globUser, send } = req.body;

    const receiver = await userModel.findOne({ email: send.sendEmail });

    if (!receiver) {
      return res.send("No receiver exsits");
    }

    const receiveMoney = await userModel.findOne({
      email: globUser.email,
      balance: { $gt: send.sendAmount },
    });

    if (!receiveMoney) {
      return res.send("Sender does not have enough money");
    }

    await userModel
      .updateOne(
        { email: send.sendEmail },
        { $inc: { balance: send.sendAmount } }
      )
      .then()
      .catch((err) => res.json(err));

    await userModel
      .updateOne(
        { email: globUser.email },
        { $inc: { balance: -send.sendAmount } }
      )
      .then()
      .catch((err) => res.json(err));

    transModel
      .create({
        source: globUser.email,
        destination: send.sendEmail,
        amount: send.sendAmount,
      })
      .then((transData) => res.json("Transaction Completed"))
      .catch((err) => res.json(err));
  } catch (err) {
    res.json(err);
  }
});

app.post("/showTrans", async (req, res) => {
  const { globUser } = req.body;

  const list = await transModel.find({
    $or: [{ source: globUser.email }, { destination: globUser.email }],
  });

  res.json(list);
});
