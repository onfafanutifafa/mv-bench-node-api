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
  const maxValidByteValue = Math.floor(256 / alphabetLength) * alphabetLength;

  let out = "";
  let randomBytesBuffer = Buffer.alloc(0);
  let bufferIndex = 0;

  while (out.length < length) {
    if (bufferIndex >= randomBytesBuffer.length || randomBytesBuffer.length - bufferIndex < (length - out.length)) {
      const bytesToGenerate = Math.max(32, (length - out.length) * 2);
      randomBytesBuffer = crypto.randomBytes(bytesToGenerate);
      bufferIndex = 0;
    }

    const byte = randomBytesBuffer[bufferIndex];
    bufferIndex++;

    if (byte < maxValidByteValue) {
      out += alphabet[byte % alphabetLength];
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