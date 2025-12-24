const redisClient = require('../utils/redisClient');

async function redisEvent(req, res, next) {
  //const eventId = req.params.id;
  const eventId = "1.245625687";
  console.log("Redis event cache for ID:", eventId);
  if (!eventId) return next();
  try {
    const eventJson = await redisClient.hGetAll(`event_${eventId}`);
    console.log("Redis event cache for ID:", eventId, "Result:", eventJson);
    if (eventJson) {
      return res.json(JSON.parse(eventJson));
    }
    return next();
  } catch (err) {
    return next(); // On error, just continue to DB
  }
}

module.exports = redisEvent;
