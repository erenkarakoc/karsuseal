// Generates a VAPID key pair for browser push notifications.
//   npm run vapid
// Copy the output into .env.local (dev) and `wrangler secret put` (production).
const { subtle } = globalThis.crypto;

const pair = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const raw = new Uint8Array(await subtle.exportKey("raw", pair.publicKey));
const jwk = await subtle.exportKey("jwk", pair.privateKey);
const b64url = (bytes) => Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${b64url(raw)}`);
console.log(`VAPID_PRIVATE_KEY='${JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, d: jwk.d })}'`);
