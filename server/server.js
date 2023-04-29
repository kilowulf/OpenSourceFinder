import express from "express";
import axios from "axios";
import cors from "cors";
import passport from "passport";
import passportConfig from "../passport.js";
import session from "express-session";
import mongoose from "mongoose";
import connectDB from "./db.js";
import User from "../src/models/User.js";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import authRoutes from "../src/routes/auth.js";
// const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const PAT = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
// passportConfig(passport);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// profile route
import profileRoutes from "../src/routes/profile.js";
app.use("/api/profile", profileRoutes);

// Connect to the MongoDB database
connectDB();

app.post("/search", async (req, res) => {
  const { languages, labels, frameworks } = req.body;

  const languageQuery =
    languages && languages.map(lang => `language:${lang}`).join(" ");
  const labelQuery =
    labels && labels.map(label => `label:"${label}"`).join(" ");
  const frameworkQuery =
    frameworks && frameworks.map(framework => `${framework}`).join(" ");

  const queryParts = [
    languageQuery,
    labelQuery,
    frameworkQuery,
    "stars:>0"
  ].filter(Boolean);

  const searchQuery = queryParts.join(" ");
  const requestUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    searchQuery
  )}&sort=stars&order=desc`;

  try {
    const { data } = await axios.get(requestUrl, {
      headers: {
        Authorization: `token ${PAT}`
      }
    });
    res.json(data.items);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Unable to fetch data from GitHub." });
  }
});

// save user data to database
app.post("/api/user/save", async (req, res) => {
  const userData = req.body;
  try {
    const user = new User(userData);
    await user.save();
    res.status(201).json({ message: "User saved successfully.", user });
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error details:", error); // Add this line to log more information about the error
    res.status(500).json({ error: "Unable to save user data." });
  }
});

// retrieve user data from database
app.get("/api/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Unable to fetch user data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
