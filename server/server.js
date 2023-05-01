import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// import User from "../src/models/User.js";
// import connectDB from "./db.js";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();
dotenv.config();

// Define User schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: String,
    email: String,
    password: String,
    occupation: String,
    languages: [String],
    labels: [String]
  },
  { collection: "user_profiles", versionKey: false }
);

// Create User model
const User = mongoose.model("user_profile", userSchema);

// database connection
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // useCreateIndex: true,
    });

    // Log the database name and the collections in the database
    console.log(
      `MongoDB connected to ${connection.connection.db.databaseName}`
    );
    const collections = await connection.connection.db
      .listCollections()
      .toArray();
    console.log("Collections:", collections.map(collection => collection.name));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const PAT = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
// Connect to the MongoDB database: make sure DB connection occurs before references to models
// otherwise you get model method timeouts ie insertOne() buffer timeouts

// import User from "../src/models/User.js";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control_Allow_Methods", "GET,POST,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// passportConfig(passport);
// app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // routes
// import authRoutes from "../src/routes/auth.js";
// import profileRoutes from "../src/routes/profile.js";
// import userRoutes from "../src/routes/user.js";

// // After other route definitions
// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);

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

// Add this route definition after other route definitions
app.post("/api/user/register", async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      occupation: userData.occupation,
      languages: userData.languages,
      labels: userData.labels
    });
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully.", User: user });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Unable to register user." });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({ User: user });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Unable to authenticate user." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
