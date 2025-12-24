const express = require("express");
const router = express.Router();
const Punter = require("../../models/Punter");
const PunterTransDetail = require("../../models/PunterTransDetails");

//router.use(auth);

router.post("/pl-by-date", async (req, res) => {
  // ###############do not use it for now################
});

module.exports = router;
