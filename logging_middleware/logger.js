const axios = require("axios");
require("dotenv").config();

let accessToken = "";

// You will set token from auth.js
function setToken(token) {
  accessToken = token;
}

async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post(
      `${process.env.BASE_URL}/logs`,
      {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    console.log("Log success:", res.data.message);
  } catch (err) {
    console.error("Log failed:", err.response?.data || err.message);
  }
}

module.exports = { Log, setToken };