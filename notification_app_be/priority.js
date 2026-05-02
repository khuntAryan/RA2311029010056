const { getToken, getAuthHeader } = require("../auth");
const { Log, setToken } = require("../logging_middleware/logger");
const axios = require("axios");
require("dotenv").config();

// fetch notifications from API
async function fetchNotifications() {
  try {
    const res = await axios.get(
      `${process.env.BASE_URL}/notifications`,
      getAuthHeader()
    );

    return res.data.notifications;
  } catch (err) {
    // log error if API fails
    await Log("backend", "error", "service", "error fetching notifications");
    console.error(err.response?.data || err.message);
  }
}

// sort notifications based on priority and time
function getTopNotifications(notifications) {
  const priority = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  // copy array so original data is not changed
  return [...notifications]
    .sort((a, b) => {
      // first sort by type priority
      if (priority[b.Type] !== priority[a.Type]) {
        return priority[b.Type] - priority[a.Type];
      }

      // if same type, sort by latest time
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, 10); // take top 10 only
}

async function run() {
  // get token first
  const token = await getToken(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  setToken(token);

  // get notifications
  const notifications = await fetchNotifications();

  if (!notifications) return;

  // process top notifications
  const top = getTopNotifications(notifications);

  console.log("Top Notifications:", top);

  // log success
  await Log("backend", "info", "service", "top notifications computed");
}

run();