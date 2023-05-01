// // import express from "express";
// const express = require("express");
// const router = express.Router();
// // import User from "../models/User.js";
// const User = require("../models/User.js");

// router.post("/update", async (req, res) => {
//   const { userId, userProfile, recommendedProjects } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.set({
//       ...userProfile,
//       recommendedProjects
//     });

//     await user.save();

//     res.json({ message: "Profile updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile", error });
//   }
// });

// // export default router;
// module.exports = router;