const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { CompactEncrypt, importJWK } = require("jose");
const BlacklistedToken = require("../models/BlacklistedToken");
const Punter = require("../models/Punter");
const getLocationWithIP = require("../utils/getLocationWithIP"); // implement this util
const BzUserLoginHistory = require("../models/BzUserLoginHistory");

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth";
const JWT_TTL_SECS = Number(process.env.JWT_TTL_SECS || 100 * 60 * 60); // 100h
const isProd = process.env.NODE_ENV === "production";
const SAME_SITE = (
  process.env.AUTH_COOKIE_SAMESITE || (isProd ? "none" : "lax")
).toLowerCase();

function setJwtCookie(res, token) {
  const ttlMs = JWT_TTL_SECS * 1000;
  /*
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd || SAME_SITE === "none",
    sameSite: SAME_SITE,
    path: "/",
    maxAge: ttlMs,
    // expires: new Date(Date.now() + ttlMs),
    // domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
  });*/

  const opts = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? "none" : "lax",                      // required when SameSite=None
    maxAge: 1000 * 60 * 60 * 24 * 7,                       // you can omit 'expires'; maxAge is enough
  };
//path: '/',
  //httpOnly: true,

  // Only set domain if provided (no protocol/port)
  const dom = process.env.AUTH_COOKIE_DOMAIN;
  if (dom && !/^https?:/i.test(dom) && !/:\d+$/i.test(dom)) {
    opts.domain = dom;                   // e.g. "mplexch.co" or ".mplexch.co"
  }

  res.cookie(AUTH_COOKIE_NAME, token, opts);
}

function regenSession(req) {
  return new Promise((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve()))
  );
}
function saveSession(req) {
  return new Promise((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve()))
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { uname, passpin, publicJwk } = req.body;
    if (!publicJwk)
      return res.status(400).json({ message: "Missing publicJwk" });

    const user = await Punter.findOne({ uname, stat: 1 });
    if (!user) {
      const recipKey = await importJWK(publicJwk, "ECDH-ES+A256KW");
      const pt = new TextEncoder().encode(
        JSON.stringify({ message: "Invalid credentials" })
      );
      const jwe = await new CompactEncrypt(pt)
        .setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: "A256GCM" })
        .encrypt(recipKey);
      return res
        .type("application/jose")
        .set("x-encrypted", "1")
        .status(401)
        .send(jwe);
    }

    const ok = await require("bcryptjs").compare(passpin, user.passpin);
    if (!ok) {
      const recipKey = await importJWK(publicJwk, "ECDH-ES+A256KW");
      const pt = new TextEncoder().encode(
        JSON.stringify({ message: "Invalid credentials" })
      );
      const jwe = await new CompactEncrypt(pt)
        .setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: "A256GCM" })
        .encrypt(recipKey);
      return res
        .type("application/jose")
        .set("x-encrypted", "1")
        .status(401)
        .send(jwe);
    }

    // sanitize user
    const u = user.toObject();
    delete u.passpin;
    const safeUser = {
      _id: u._id,
      uname: u.uname,
      user_role: u.user_role,
      email: u.email,
      stat: u.stat,
      opin_bal: u.opin_bal,
      bz_balance: u.bz_balance,
      bet_status: u.bet_status,
      last_login: new Date(),
    };
    console.log("safeUser->",safeUser);
    user.last_login = safeUser.last_login;
    await user.save();

    // new session
    await regenSession(req);
    req.session.userId = String(user._id);
    req.session.publicJwk = publicJwk;

    // jwt cookie
    const payload = {
      id: user._id,
      uname: user.uname,
      user_role: user.user_role,
      email: user.email,
      stat: user.stat,
      bz_balance: user.bz_balance,
      opin_bal: user.opin_bal,
      bet_status: user.bet_status,
      jti: uuidv4(),
    };
    console.log("payload->",payload); 
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: JWT_TTL_SECS,
    });
    setJwtCookie(res, token);

    // encrypted body
    const recipKey = await importJWK(req.session.publicJwk, "ECDH-ES+A256KW");
    const pt = new TextEncoder().encode(JSON.stringify({ user: safeUser }));
    const jwe = await new CompactEncrypt(pt)
      .setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: "A256GCM" })
      .encrypt(recipKey);

    await saveSession(req);


    // Log user login history
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const session_id = req.sessionID;
    const userid = user._id;
    //const uname = user.uname;
    const site_toke = token;
    const userHistoryLogData = {
      uname,
      ssid: session_id,
      ipaddr: ip_address,
      logon: "1",
      userAutoId: userid,
      refUrl: "UserLogin",
      site_toke,
    };

    // Optionally enrich with IP location data
    const ipData = await getLocationWithIP(ip_address);
    console.log("ipData->", ipData);
    if (ipData) {
      userHistoryLogData.city = ipData.city;
      userHistoryLogData.latitude = ipData.latitude;
      userHistoryLogData.longitude = ipData.longitude;
      userHistoryLogData.country = ipData.country;
      userHistoryLogData.org = ipData.org;
      userHistoryLogData.timezone = ipData.time_zone;
    }

    // Save login history
    await BzUserLoginHistory.create(userHistoryLogData);


    console.log("jwe->", jwe);

    return res
      .type("application/jose")
      .set("x-encrypted", "1")
      .status(200)
      .send(jwe);
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});



// POST /api/auth/logout
router.get("/logout", async (req, res) => {
  // Read token from cookie
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    // Clear cookie
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd || SAME_SITE === "none",
      sameSite: SAME_SITE,
      path: "/",
      domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    });
    return res.json({ message: "Logged out" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Blacklist current JTI until token expiry
    await BlacklistedToken.create({
      jti: decoded.jti,
      expiresAt: new Date(decoded.exp * 1000),
    });

    // Clear cookie
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd || SAME_SITE === "none",
      sameSite: SAME_SITE,
      path: "/",
      domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    });
    if (req.session) req.session.destroy(() => {});

    return res.json({ message: "Logged out" });
  } catch (err) {
    // Token invalid/expired: clear cookie and respond success
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd || SAME_SITE === "none",
      sameSite: SAME_SITE,
      path: "/",
      domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    });
    return res.json({ message: "Logged out" });
  }
});

module.exports = router;
