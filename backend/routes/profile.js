const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const BzStakeSettings = require("../models/BzStakeSettings");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

router.use(auth);

// Stake map: stake1–4 are type 'g', stake5–8 are type 'p'
const stakeMap = [
  { name: "stake1", type: "g" },
  { name: "stake2", type: "g" },
  { name: "stake3", type: "g" },
  { name: "stake4", type: "g" },
  { name: "stake5", type: "p" },
  { name: "stake6", type: "p" },
  { name: "stake7", type: "p" },
  { name: "stake8", type: "p" },
];

// GET /profile
router.get("/", async (req, res) => {
  try {
    const settings = await BzStakeSettings.find({ user_id: req.user._id });

    const response = {};
    stakeMap.forEach(({ name, type }, index) => {
      const setting = settings[index];
      response[name] = setting ? setting.button_value : 0;
    });

    res.json(response);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /profile
router.post("/", async (req, res) => {
  try {
    // 1. Delete all existing stake settings for the user
    await BzStakeSettings.deleteMany({ user_id: req.user._id });

    // 2. Prepare new documents from request
    const newSettings = stakeMap.map(({ name, type }) => ({
      user_id: req.user._id,
      type,
      button_value: parseInt(req.body[name]) || 0,
    }));

    // 3. Insert the new settings
    await BzStakeSettings.insertMany(newSettings);

    res.json({ message: "Stake settings updated successfully" });
  } catch (err) {
    console.error("Error replacing stake settings:", err);
    res.status(500).json({ message: "Failed to update stake settings" });
  }
});

// POST /profile/password
router.post("/password", async (req, res) => {
  const { passpin } = req.body;

  if (!passpin || passpin.length < 6) {
    return res
      .status(400)
      .json({ message: "Passpin must be at least 6 characters." });
  }

  try {
    const hashed = await bcrypt.hash(passpin, 10);
    await Punter.findByIdAndUpdate(req.user._id, { passpin: hashed });
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

module.exports = router;
