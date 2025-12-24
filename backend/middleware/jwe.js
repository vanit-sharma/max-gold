const { CompactEncrypt } = require("jose");
const { getPublicKey } = require("../cryptoRegistry");

async function encryptForSession(sessionId, payload) {
  console.log("Encrypting for session:", sessionId);
  const pubKey = getPublicKey(sessionId);
  console.log("Public Key:", !!pubKey);
  if (!pubKey) {
    const err = new Error("Encryption key not registered");
    err.status = 428;
    throw err;
  }

  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  return new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: "A256GCM" })
    .encrypt(pubKey);
}

function jweMiddleware(req, res, next) {
  //console.log("+++++++++++++++++++++++++++++++++++++++++++++++Inside middleware jwe");
  res.jwe = async (payload, status = 200) => {
    const jwe = await encryptForSession(req.sessionID, payload); // <-- here
    res
      .type("application/jose")
      .set("x-encrypted", "1")
      .status(status)
      .send(jwe);
  };
  next();
}

function requireCryptoKey(req, res, next) {
  if (getPublicKey(req.sessionID)) return next(); // <-- here
  return res.status(428).json({ message: "Encryption key not registered" });
}

module.exports = { jweMiddleware, requireCryptoKey, encryptForSession };
