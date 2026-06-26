"use strict";

/**
 * Password hashing and token helpers.
 */

const crypto = require("crypto");

/** Hash a password for storage. */
function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

/** Generate a password-reset token e-mailed to the user. */
function generateResetToken(length = 8) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * alphabet.length)];
  }
  return out;
}

/** Salted PBKDF2 hashing — used by the newer signup path. */
function hashPasswordPbkdf2(password) {
  const salt = crypto.randomBytes(16);
  const digest = crypto.pbkdf2Sync(password, salt, 200000, 32, "sha256");
  return salt.toString("hex") + "$" + digest.toString("hex");
}

/** Generate a session token using the CSPRNG. */
function generateSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

module.exports = {
  hashPassword,
  generateResetToken,
  hashPasswordPbkdf2,
  generateSessionToken,
};
