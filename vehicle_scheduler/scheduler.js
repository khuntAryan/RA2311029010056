const axios = require("axios");
require("dotenv").config();

const { getToken, getAuthHeader } = require("../auth");
const { Log, setToken } = require("../logging_middleware/logger");
require("dotenv").config();

async function fetchData() {
  try {
    await Log("backend", "info", "service", "Fetching depots");

    const depotRes = await axios.get(
      `${process.env.BASE_URL}/depots`,
      getAuthHeader()
    );

    await Log("backend", "info", "service", "Fetching vehicles");
    if (!vehicles || vehicles.length === 0) {
        await Log("backend", "warn", "service", "No vehicles data found");
        return;
      }
    const vehicleRes = await axios.get(
      `${process.env.BASE_URL}/vehicles`,
      getAuthHeader()
    );

    return {
      depots: depotRes.data.depots,
      vehicles: vehicleRes.data.vehicles
    };
  } catch (err) {
    await Log("backend", "error", "service", "Error fetching data");
    console.error(err.response?.data || err.message);
  }
}

function knapsack(tasks, maxHours) {
    const n = tasks.length;
  
    const dp = Array.from({ length: n + 1 }, () =>
      Array(maxHours + 1).fill(0)
    );
  
    for (let i = 1; i <= n; i++) {
      const { Duration, Impact } = tasks[i - 1];
  
      for (let w = 0; w <= maxHours; w++) {
        if (Duration <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            Impact + dp[i - 1][w - Duration]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }
  
    return dp[n][maxHours];
  }


  async function runScheduler() {
    const token = await getToken("66272e2d-d27b-4084-81ae-d592001e3282", "QNEexVRUTGKpjDPr");
    setToken(token);
    const data = await fetchData();
  
    if (!data) return;
  
    const { depots, vehicles } = data;
  
    for (let depot of depots) {
      const maxHours = depot.MechanicHours;
  
      const maxImpact = knapsack(vehicles, maxHours);
  
      console.log(
        `Depot ${depot.ID} → Max Impact: ${maxImpact}`
      );
  
      await Log(
        "backend",
        "info",
        "service",
        `Depot ${depot.ID} computed with impact ${maxImpact}`
      );
    }
  }
  
  await Log("backend", "info", "service", "Starting scheduler execution");
  runScheduler();