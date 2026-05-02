const axios = require("axios");
require("dotenv").config();

const { Log, setToken } = require("./logging_middleware/logger");

// store token
let accessToken = "";

// register once to get clientID and clientSecret
async function register() {
  const res = await axios.post(`${process.env.BASE_URL}/register`, {
    email: "ak7895@srmist.edu.in",
    name: "Aryan Khunt",
    mobileNo: "6354215114",
    githubUsername: "khuntAryan",
    rollNo: "RA2311029010056",
    accessCode: "QkbpxH"
  });

  console.log("SAVE THIS:", res.data);
}

// get access token
async function getToken(clientID, clientSecret) {
  const res = await axios.post(`${process.env.BASE_URL}/auth`, {
    email: "ak7895@srmist.edu.in",
    name: "Aryan Khunt",
    rollNo: "RA2311029010056",
    accessCode: "QkbpxH",
    clientID,
    clientSecret
  });

  accessToken = res.data.access_token;
  return accessToken;
}

// return auth header
function getAuthHeader() {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
}

// optional test function (manual use only)
async function testDepots() {
  try {
    const res = await axios.get(
      `${process.env.BASE_URL}/depots`,
      getAuthHeader()
    );

    console.log("Depots:", res.data);
  } catch (err) {
    console.error("Error fetching depots:", err.response?.data || err.message);
  }
}

module.exports = { register, getToken, getAuthHeader, testDepots };