const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const BzStakeSettings = require("../models/BzStakeSettings");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const {
  getDownlineRecursive,
  get_user_info_byid,
} = require("../utils/function");

router.use(auth);

// GET /user - will return logged in user's details
router.get("/", async (req, res) => {
  //console.log("res->",req);
  const userObj = req.user.toObject();
  //remove passpin from the response
  const { passpin, ...rest } = userObj;
  return res.json(rest);
});

router.get("/:id/downline", async (req, res) => {
  console.log("Fetching downline for user ID:", req.params.id);
  if (!req.params.id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const userInfo = await get_user_info_byid(req);
  if (!userInfo) {
    return res.status(404).json({ error: "User not found or access denied" });
  }

  delete userInfo.full_chain;
  //console.log("req.params.id:", req.params.id);

  const downnLine = await getDownlineRecursive(req.params.id);

  let returnObj = {};
  returnObj.userInfo = userInfo;
  returnObj.downnLine = downnLine;

  console.log("returnObj:", returnObj);

  if (!downnLine) {
    return res.status(404).json({ error: "No downline found for this user" });
    //return res.jwe({ error: "No downline found for this user" }, 404);
  }
  //return res.json(returnObj);
  return res.jwe(returnObj);
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const userInfo = await get_user_info_byid(req);

  if (!userInfo) {
    return res.status(404).json({ error: "Unauthorized attempt" });
  }

  delete userInfo.full_chain;

  return res.json(userInfo);
});



module.exports = router;
