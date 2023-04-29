import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    occupation: { type: String, required: false },
    languages: [{ type: String }],
    labels: [{ type: String }]
  },
  { collection: "user_profiles" }
);

const User = mongoose.model("User", userSchema);
export default User;
