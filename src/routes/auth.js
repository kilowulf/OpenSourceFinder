// // import express from "express";
// const express = require("express");
// const router = express.Router();
// // import bcrypt from "bcryptjs";
// const bcrypt = require("bcryptjs");

// // import User from "../models/User.js";
// const User = require("../models/User.js"); // Adjust the path to your User model file

// // Register route
// router.post("/register", async (req, res) => {
//   const { username, email, password, occupation, languages, labels } = req.body;
//   console.log("From auth.js", req.body);
//   try {
//     // const userExists = await User.findOne({ email: email });
//     // if (userExists) {
//     //   return res.status(400).json({ message: "Email already registered" });
//     // }
//     // console.log(userExists);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log("from auth.js", hashedPassword);
//     console.log("Creating a new user...");
//     const newUser = new User({
//       username: username,
//       email: email,
//       password: hashedPassword,
//       occupation: occupation,
//       languages: languages,
//       labels: labels
//     });

//     try {
//       await newUser.save();
//       console.log("New user saved:", newUser);
//     } catch (error) {
//       console.log("Error saving user:", error);
//     }
//     res
//       .status(201)
//       .json({ message: "User registered successfully", user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error: error });
//   }
// });

// Login route
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     console.log("Error:", err);
//     console.log("User:", user);
//     console.log("Info:", info);
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error during authentication", error: err });
//     }
//     if (!user) {
//       return res.status(400).json({ message: info.message });
//     }

//     req.logIn(user, err => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ message: "Error logging in", error: err });
//       }
//       return res
//         .status(200)
//         .json({ message: "User logged in successfully", user: user });
//     });
//   })(req, res, next);
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(400).json({ message: "Email is not registered" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       // If the password matches, set the user ID in the session
//       req.session.userId = user._id;

//       return res
//         .status(200)
//         .json({ message: "User logged in successfully", user: user });
//     } else {
//       return res.status(400).json({ message: "Password incorrect" });
//     }
//   } catch (error) {
//     console.error("Error during authentication:", error.message);
//     console.error(error.stack);
//     res
//       .status(500)
//       .json({ message: "Error during authentication", error: error });
//   }
// });

// // Update user route
// router.put("/update/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
//       new: true,
//       runValidators: true
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found, update failed" });
//     }

//     res
//       .status(200)
//       .json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user", error: error });
//   }
// });

// // export default router;
// module.exports = router;
