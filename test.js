// const axios = require("axios");
import axios from "axios";

const testRegister = async () => {
  try {
    const userData = {
      username: "TestUser",
      email: "test@example.com",
      password: "Test1234"
    };

    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      userData
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};

testRegister();
