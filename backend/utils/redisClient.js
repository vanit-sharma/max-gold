const { JsonWebTokenError } = require("jsonwebtoken");
const { createClient } = require("redis");

 
const event_const = 'event_';
const betlist_const = 'betlist_';
const book_const = 'book_';
const bookmaker_const = 'bookmaker_';
const figure_const = 'figure_';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect once, at startup
try {
  redisClient.connect();
} catch (err) {
  console.error("Failed to connect to Redis:", err);
}

const getData = async(eventId,autoId)=> { 

  let allData = await getAllData(eventId);  
  let jsonValue = ""; 
  const keys = Object.keys(allData); 
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key==autoId) {
      jsonValue = allData[key];
      break;
    } 
  }
  if(jsonValue!="") {
    jsonValue = JSON.parse(jsonValue);
  }
 return jsonValue;  
} 

const getAllData = async(eventId)=> { 

  const key = event_const+""+eventId; 
  data =  await redisClient.hGetAll(key);
  return data; 
}

module.exports = {
  redisClient,
  getData,
  getAllData
  
};
 
