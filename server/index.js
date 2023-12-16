const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// การเชื่อมต่อ MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/15Puzzle", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// กำหนดโมเดล Register
const RegisterModel = require("./models/Register");

// สร้าง API Endpoint สำหรับลงทะเบียน
// ... (your existing imports and setup)

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Set a default value of null for the time field
  const defaultTime = null;

  // Check if the email already exists
  RegisterModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json("Already have an account");
      } else {
        // Create a new user with the default value of null for the time field
        RegisterModel.create({ name, email, password, time: defaultTime })
          .then(() => res.json("Account created"))
          .catch((err) => {
            console.log("Error creating account:", err);
            res.status(500).json("Internal Server Error");
          });
      }
    })
    .catch((err) => {
      console.log("Error checking existing account:", err);
      res.status(500).json("Internal Server Error");
    });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  // Check if the user with the provided name exists
  RegisterModel.findOne({ name: name })
    .then((user) => {
      if (!user) {
        res.status(401).json("User not found");
      } else {
        // Check if the password matches
        if (user.password === password) {
          res.json("Login successful");
        } else {
          res.status(401).json("Incorrect password");
        }
      }
    })
    .catch((err) => {
      console.log("Error checking user for login:", err);
      res.status(500).json("Internal Server Error");
    });
});

// กำหนด Port ที่ Server จะใช้
const port = 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
