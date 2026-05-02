const { getToken, getAuthHeader } = require("../auth");
const { Log, setToken } = require("../logging_middleware/logger");
const axios = require("axios");
require("dotenv").config();

const priorityMap = {
  placement: 3,
  result: 2,
  event: 1
};

async function fetchNotifications() {
  try {
    const res = await axios.get(
      `${process.env.BASE_URL}/notifications`,
      getAuthHeader()
    );

    return res.data.notifications;
  } catch (err) {
    await Log("backend", "error", "service", "Error fetching notifications");
    console.error(err.response?.data || err.message);
  }
}

function getTopNotifications(notifications) {
  const priority = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  return [...notifications] // ✅ clone array
    .sort((a, b) => {
      // 1. Priority sort
      if (priority[b.Type] !== priority[a.Type]) {
        return priority[b.Type] - priority[a.Type];
      }

      // 2. Recency sort
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, 10); // top 10
}

async function run() {
  const token = await getToken("66272e2d-d27b-4084-81ae-d592001e3282", "QNEexVRUTGKpjDPr");
  setToken(token);

  const notifications = await fetchNotifications();

  const top = getTopNotifications(notifications);

  console.log("Top Notifications:", top);

  await Log("backend", "info", "service", "Top notifications computed");
}

run();