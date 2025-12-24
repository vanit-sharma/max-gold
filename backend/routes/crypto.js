const express = require("express");
const router = express.Router();
const { CompactEncrypt } = require("jose");
const { setPublicKey, getPublicKey } = require("../cryptoRegistry");

// Browser posts its public JWK once after login or when the user opens a new tag
router.post("/register-key", (req, res) => {
  const { publicJwk } = req.body || {};
  if (!publicJwk) return res.status(400).json({ message: "Missing publicJwk" });
  req.session.publicJwk = publicJwk;
  req.session.save(err => err ? res.status(500).json({ message: "Failed to save session" }) : res.sendStatus(204));
});


module.exports = router;
