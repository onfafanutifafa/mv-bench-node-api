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
  // Calculate the largest multiple of alphabetLength that is less than or equal to 255.
  // This is used for rejection sampling to ensure uniform distribution.
  const maxValidValue = Math.floor(256 / alphabetLength) * alphabetLength;

  let out = "";
  // Generate enough random bytes to cover the requested length,
  // accounting for rejection sampling. A factor of 2 is a safe overestimate.
  let randomBytesBuffer = crypto.randomBytes(length * 2);
  let byteIndex = 0;

  for (let i = 0; i < length; i += 1) {
    let value;
    do {
      // If we run out of bytes in the current buffer, generate more.
      // This is unlikely for typical lengths with a buffer of length * 2.
      if (byteIndex >= randomBytesBuffer.length) {
        randomBytesBuffer = crypto.randomBytes(length * 2);
        byteIndex = 0;
      }
      value = randomBytesBuffer.readUInt8(byteIndex++);
    } while (value >= maxValidValue); // Rejection sampling to avoid bias

    out += alphabet[value % alphabetLength];
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