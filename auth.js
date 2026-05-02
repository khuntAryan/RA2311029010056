const axios = require("axios");
require("dotenv").config();
const { Log, setToken } = require("./logging_middleware/logger");

let accessToken = "";

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

function getAuthHeader() {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
}

(async () => {
    try {
      const token = await getToken("66272e2d-d27b-4084-81ae-d592001e3282", "QNEexVRUTGKpjDPr");
  
      console.log("Access Token:", token);
      setToken(token);
      await Log("backend", "info", "controller", "Testing logging middleware");
      await testDepots(); 
  
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  })();

  async function testDepots() {
    const res = await axios.get(
      `${process.env.BASE_URL}/depots`,
      getAuthHeader()
    );
  
    console.log("Depots:", res.data);
  }

module.exports = { register, getToken, getAuthHeader };