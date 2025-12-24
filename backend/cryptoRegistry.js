const { importJWK } = require("jose");

// Map sessionId -> CryptoKey
const sessionKeys = new Map();

async function setPublicKey(sessionId, jwk) {
  const key = await importJWK(jwk, "ECDH-ES+A256KW");
  sessionKeys.set(sessionId, key);
}

function getPublicKey(sessionId) {
  //console.log("Session Keys Map:", sessionKeys);
  return sessionKeys.get(sessionId);
}

function clearPublicKey(sessionId) {
  sessionKeys.delete(sessionId);
}

module.exports = { setPublicKey, getPublicKey, clearPublicKey };
