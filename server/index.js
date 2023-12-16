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
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // ตรวจสอบว่ามีบัญชีนี้อยู่แล้วหรือไม่
  RegisterModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json("Already have an account");
      } else {
        // สร้างบัญชีใหม่
        RegisterModel.create({ name: name, email: email, password: password })
          .then((result) => res.json("Account created"))
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

// กำหนด Port ที่ Server จะใช้
const port = 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
