const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./db.js");
var jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("./models/UserModel");
var validator = require("email-validator");
// Load environment variables from .env file
dotenv.config();

// MongoDB connection
connectDB();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Define email and password patterns

// Registration route
app.post(
  "/api/signup",

  async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    const isEmail = validator.validate(email);

    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      if (!isEmail) {
        return res.status(400).json({ message: "Please enter a valid email" });
      }

      if (name.length < 6 || password.length < 6) {
        return res
          .status(400)
          .json({ message: "Minimum 6 characters are required" });
      }

      // Hash the password
      const bcryptPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        name,

        email,

        password: bcryptPassword,
      });

      await user.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user._id }, "AHsa@123");

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_MODE} port no ${PORT}`);
});
