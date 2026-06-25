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
  const alphabetLength = alphabet.length;
  // Calculate the maximum byte value that can be used without introducing modulo bias.
  // Any byte value >= maxValidByte would cause bias if used with modulo alphabetLength.
  const maxValidByte = Math.floor(256 / alphabetLength) * alphabetLength;

  let out = "";
  while (out.length < length) {
    // Generate enough random bytes to potentially fill the remaining length.
    // We might need more than `length - out.length` bytes due to rejection sampling.
    const bytesToGenerate = length - out.length;
    const randomBytes = crypto.randomBytes(bytesToGenerate);
    for (let i = 0; i < randomBytes.length && out.length < length; i += 1) {
      const byte = randomBytes[i];
      if (byte < maxValidByte) { // Only use bytes that won't introduce bias
        out += alphabet[byte % alphabetLength];
      }
    }
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