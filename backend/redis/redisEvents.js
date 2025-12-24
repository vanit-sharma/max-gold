const redisClient = require("../utils/redisClient");

async function redisEvents(req, res, next) {
  try {
    const eventsJson = await redisClient.hGetAll("event_bz_events");
    console.log("redisEvents->");
    if (eventsJson) {
      return res.json(JSON.parse(eventsJson));
    }
    return next();
  } catch (err) {
    return next();
  }
}

module.exports = redisEvents;
