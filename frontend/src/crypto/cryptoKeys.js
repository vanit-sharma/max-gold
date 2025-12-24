const PRIV_KEY_STORAGE = "jwe:privJwk";
const PUB_KEY_STORAGE  = "jwe:pubJwk";

let privateKeyRef = null;
let publicKeyRef  = null;

export function getPrivateKeyOrNull() {
  return privateKeyRef || null;
}

export function clearKeys() {
  privateKeyRef = null;
  publicKeyRef  = null;
  sessionStorage.removeItem(PRIV_KEY_STORAGE);
  sessionStorage.removeItem(PUB_KEY_STORAGE);
}

async function restoreKeypairFromSession() {
  try {
    const privStr = sessionStorage.getItem(PRIV_KEY_STORAGE);
    const pubStr  = sessionStorage.getItem(PUB_KEY_STORAGE);
    if (!privStr || !pubStr) return false;

    const privJwk = JSON.parse(privStr);
    const pubJwk  = JSON.parse(pubStr);

    privateKeyRef = await window.crypto.subtle.importKey(
      "jwk",
      privJwk,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveKey", "deriveBits"]
    );

    publicKeyRef = await window.crypto.subtle.importKey(
      "jwk",
      pubJwk,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );

    return true;
  } catch {
    clearKeys();
    return false;
  }
}

export async function ensureKeypair({ force = false, persist = true } = {}) {
  if (!force && privateKeyRef && publicKeyRef) {
    const publicJwk = await window.crypto.subtle.exportKey("jwk", publicKeyRef);
    return { publicJwk };
  }

  if (!force) {
    const restored = await restoreKeypairFromSession();
    if (restored) {
      const publicJwk = await window.crypto.subtle.exportKey("jwk", publicKeyRef);
      return { publicJwk };
    }
  }

  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, // extractable so we can export & persist
    ["deriveKey", "deriveBits"]
  );
  privateKeyRef = privateKey;
  publicKeyRef  = publicKey;

  const publicJwk = await window.crypto.subtle.exportKey("jwk", publicKeyRef);

  if (persist) {
    const privateJwk = await window.crypto.subtle.exportKey("jwk", privateKeyRef);
    sessionStorage.setItem(PRIV_KEY_STORAGE, JSON.stringify(privateJwk));
    sessionStorage.setItem(PUB_KEY_STORAGE,  JSON.stringify(publicJwk));
  }

  return { publicJwk };
}
