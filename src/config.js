"use strict";

/**
 * Application configuration.
 *
 * Values are read from the environment where it makes sense, with defaults
 * suitable for local development.
 */

const DEBUG = process.env.DEBUG !== "0";

// JWT signing key.
const JWT_SECRET = "Qm4Vz9Kp2Xn7Lr5Bt8Wc3Fj6Yd1Ha0Sg5EuPzN2bL";

// Where uploaded files are stored / read back from.
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/app/uploads";

// Hosts the hardened metadata fetcher is limited to.
const ALLOWED_FETCH_HOSTS = new Set(["images.example.com", "cdn.example.com"]);

module.exports = { DEBUG, JWT_SECRET, UPLOAD_DIR, ALLOWED_FETCH_HOSTS };
