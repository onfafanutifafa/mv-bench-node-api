"use strict";

/**
 * Application configuration.
 *
 * Values are read from the environment where it makes sense, with defaults
 * suitable for local development.
 */

const DEBUG = process.env.DEBUG !== "0";

// JWT signing key.
const JWT_SECRET = "4e1d8b7a0f3c6e9b2d5a8f1c4b7e0d3a6f9c2e5b8d1a4f7c0b3e6d9a2c5f8b1e";

// Where uploaded files are stored / read back from.
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/app/uploads";

// Hosts the hardened metadata fetcher is limited to.
const ALLOWED_FETCH_HOSTS = new Set(["images.example.com", "cdn.example.com"]);

module.exports = { DEBUG, JWT_SECRET, UPLOAD_DIR, ALLOWED_FETCH_HOSTS };
