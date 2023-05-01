// import express from "express";
const express = require("express");
// import User from "../models/User.js";
const User = require("../models/User.js");

const router = express.Router();

// save user data to database
router.post("/save", async (req, res) => {
  const userData = req.body;
  try {
    const user = new User(userData);
    await user.save();
    res.status(201).json({ message: "User saved successfully.", user });
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error details:", error);
    res.status(500).json({ error: "Unable to save user data." });
  }
});

// retrieve user data from database
router.get("/:userId", async (req, res) => {
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

// export default router;
module.exports = router;
