const axios = require("axios");
require("dotenv").config();

const { getToken, getAuthHeader } = require("../auth");
const { Log, setToken } = require("../logging_middleware/logger");

// fetch depots and vehicles from API
async function fetchData() {
  try {
    await Log("backend", "info", "service", "fetching depots");

    const depotRes = await axios.get(
      `${process.env.BASE_URL}/depots`,
      getAuthHeader()
    );

    await Log("backend", "info", "service", "fetching vehicles");

    const vehicleRes = await axios.get(
      `${process.env.BASE_URL}/vehicles`,
      getAuthHeader()
    );

    const depots = depotRes.data.depots;
    const vehicles = vehicleRes.data.vehicles;

    // safety checks
    if (!Array.isArray(depots) || depots.length === 0) {
      await Log("backend", "warn", "service", "no depots data found");
      return null;
    }

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      await Log("backend", "warn", "service", "no vehicles data found");
      return { depots, vehicles: [] };
    }

    return { depots, vehicles };

  } catch (err) {
    await Log("backend", "error", "service", "error fetching data");
    console.error(err.response?.data || err.message);
    return null;
  }
}

// knapsack logic
function knapsack(tasks, maxHours) {
  const n = tasks.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(maxHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];

    const duration = task.Duration ?? task.duration;
    const impact = task.Impact ?? task.impact;

    if (duration == null || impact == null) continue;

    for (let w = 0; w <= maxHours; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          impact + dp[i - 1][w - duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
}

// main function
async function runScheduler() {
  try {
    const token = await getToken(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );

    setToken(token);

    await Log("backend", "info", "service", "starting scheduler");

    const data = await fetchData();
    if (!data) return;

    const { depots, vehicles } = data;

    // ✅ ONLY process API depots
    for (const depot of depots) {
      const maxHours = depot.MechanicHours;

      if (maxHours == null) continue;

      const maxImpact = knapsack(vehicles, maxHours);

      console.log(`Depot ${depot.ID} → Max Impact: ${maxImpact}`);

      try {
        await Log(
          "backend",
          "info",
          "service",
          `depot ${depot.ID} computed with impact ${maxImpact}`
        );
      } catch (e) {
        console.error("Log failed:", e.message);
      }
    }

  } catch (err) {
    console.error("Scheduler failed:", err.message);
  }
}

runScheduler();