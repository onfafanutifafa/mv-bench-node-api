"use strict";

/**
 * Application configuration.
 *
 * Values are read from the environment where it makes sense, with defaults
 * suitable for local development.
 */

const DEBUG = process.env.DEBUG !== "0";

// JWT signing key.
const JWT_SECRET = "s3cr3t_h4rdc0d3d_signing_key_change_me_92af00b1";

// Where uploaded files are stored / read back from.
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/app/uploads";

// Hosts the hardened metadata fetcher is limited to.
const ALLOWED_FETCH_HOSTS = new Set(["images.example.com", "cdn.example.com"]);

module.exports = { DEBUG, JWT_SECRET, UPLOAD_DIR, ALLOWED_FETCH_HOSTS };
