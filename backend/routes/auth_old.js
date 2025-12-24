const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const BlacklistedToken = require('../models/BlacklistedToken');
const Punter = require("../models/Punter");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { uname, passpin } = req.body;
  try {
    // Find user by uname
    const user = await Punter.findOne({ uname, stat: 1 }); // Only active users
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password (hashed)
    const isMatch = await bcrypt.compare(passpin, user.passpin);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Update last_login field
    user.last_login = new Date();
    await user.save();

    // JWT payload
    const payload = {
      id: user._id,
      uname: user.uname,
      user_role: user.user_role,
      email: user.email,
      stat: user.stat,
      bet_status: user.bet_status,
      jti: uuidv4() // Unique JWT ID
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "100h" });

    // Optionally, return user info except sensitive fields
    const { passpin: _, ...userData } = user.toObject();

    res.json({
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
    await BlacklistedToken.create({
      jti: decoded.jti,
      expiresAt: new Date(decoded.exp * 1000) // JWT exp is in seconds
    });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
});

module.exports = router;
