const axios = require("axios");
require("dotenv").config();

// this will store token after login
let accessToken = "";

// set token after getting it from auth.js
function setToken(token) {
  accessToken = token;
}

// main logging function used everywhere
async function Log(stack, level, pkg, message) {
  try {
    // making request body
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: message
    };

    // sending log to server
    const response = await axios.post(
      `${process.env.BASE_URL}/logs`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    console.log("Log success:", response.data.message);

  } catch (error) {
    // if log fails, print error but don't stop program
    console.error("Log failed:", error.response?.data || error.message);
  }
}

module.exports = { Log, setToken };