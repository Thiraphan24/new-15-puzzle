const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
function convertIsoDateToMinutesSeconds(isoDate) {
  const timestamp = new Date(isoDate);
  const milliseconds = timestamp.getTime();
  const totalSeconds = milliseconds / 1000;

  let remainingSeconds;

  if (totalSeconds >= 0.06) {
    remainingSeconds = (totalSeconds / 60).toFixed(5).padStart(6, "0");
  } else if (totalSeconds < 0.06) {
    remainingSeconds = (totalSeconds % 60).toFixed(3).padStart(6, "0");
  }

  const formattedSeconds = remainingSeconds.replace(/^(\d+)\.(\d+)$/, "$1.$2");
  const formattedTime = ` ${formattedSeconds} min/sec`;

  return formattedTime;
}
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
          // Return the user's name in the response
          res.json({ name: user.name, message: "Login successful" });
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

app.post("/updateBestTime", async (req, res) => {
  const { name, newBestTime } = req.body;

  try {
    // Find the user by name
    const user = await RegisterModel.findOne({ name });

    // If the user is found
    if (user) {
      // Convert current best time from ISODate to "mm:ss"
      const currentBestTime = user.time
        ? convertIsoDateToMinutesSeconds(user.time)
        : null;

      // If the new time is less than the current best time or the best time is null
      if (!user.time || newBestTime < user.time) {
        // Update the best time
        await RegisterModel.updateOne({ name }, { time: newBestTime });
        res.json({ message: "Best time updated successfully" });
      } else {
        res.json({
          message: `Best time not updated. New time (${newBestTime}) is not faster than current best time (${currentBestTime}).`,
        });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating best time:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this endpoint to your Express server
app.get("/leaderboard", async (req, res) => {
  try {
    // Find users with non-null time, sort by time in ascending order
    const users = await RegisterModel.find({ time: { $ne: null } })
      .sort({ time: 1 })
      .limit(5); // Limit to top 5 users

    // Format time as "mm:ss" and construct the response
    const leaderboardData = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      time: convertIsoDateToMinutesSeconds(user.time),
    }));

    res.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this endpoint to your Express server
app.get("/bestTime/:name", async (req, res) => {
  const { name } = req.params;

  try {
    // Find the user by name
    const user = await RegisterModel.findOne({ name });

    // If the user is found, return the best time
    if (user && user.time) {
      const formattedTime = convertIsoDateToMinutesSeconds(user.time);
      res.json({ bestTime: formattedTime });
    } else {
      res.json({ bestTime: null }); // Return null if no best time is available
    }
  } catch (error) {
    console.error("Error fetching best time:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// กำหนด Port ที่ Server จะใช้
const port = 3009;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
