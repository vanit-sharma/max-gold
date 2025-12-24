const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const BlacklistedToken = require("../models/BlacklistedToken");
const User = require("../models/Punter");

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth";
const JWT_SECRET = process.env.JWT_SECRET;

// 100 hours default
const TOKEN_TTL_SECS   = Number(process.env.JWT_TTL_SECS || 100 * 60 * 60);
// refresh if < 30 minutes remaining
const REFRESH_IF_LT    = Number(process.env.JWT_REFRESH_IF_LT || 30 * 60);

function signJwtFromDecoded(decoded) {
  // keep same jti so a single blacklist entry invalidates all refreshed tokens
  const { iat, exp, ...rest } = decoded;
  return jwt.sign(rest, JWT_SECRET, { expiresIn: TOKEN_TTL_SECS });
}

function setJwtCookie(res, token) {
  const ttlMs = TOKEN_TTL_SECS * 1000;
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: ttlMs,
    expires: new Date(Date.now() + ttlMs),
  });
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    
    if (!token) return res.status(401).json({ error: "No token provided" });

    // 1) Verify token (throws if expired/invalid)
    let decoded;
    //try {
      decoded = jwt.verify(token, JWT_SECRET);
      //console.log("decoded:", decoded);
    /*} catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Session expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }*/

    // 2) Blacklist check (by jti)
    if (decoded?.jti) {
      const blacklisted = await BlacklistedToken.findOne({ jti: decoded.jti });
      if (blacklisted) {
        return res.status(401).json({ error: "Token is blacklisted" });
      }
    }

    // 3) DB validation (user must exist & be active)
    const user = await User.findById(decoded.id);
    if (!user || user.stat === 0) {
      return res.status(401).json({ error: "User inactive or not found" });
    }

    // 4) Refresh if token is close to expiring
    const now = Math.floor(Date.now() / 1000);
    if (typeof decoded.exp === "number") {
      const secondsLeft = decoded.exp - now;
      if (secondsLeft < REFRESH_IF_LT) {
        const refreshed = signJwtFromDecoded(decoded);
        setJwtCookie(res, refreshed);
        res.setHeader("x-session-refreshed", "1");
      }
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("authMiddleware error:", e);
    res.status(500).json({ error: "Auth middleware failed" });
  }
};

module.exports = authMiddleware;
