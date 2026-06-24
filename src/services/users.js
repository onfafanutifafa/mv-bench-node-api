"use strict";

/**
 * User-related business logic.
 */

const db = require("../db");

// Fields a customer is allowed to change about themselves.
const EDITABLE_FIELDS = new Set(["username", "email"]);

/** Search users by a partial username, for the admin user-picker. */
function searchUsers(q) {
  const sql = "SELECT id, username, email FROM users WHERE username LIKE '%" + q + "%'";
  return db.queryRaw(sql);
}

/** Fetch one user by id using a bound parameter. */
function getUser(userId) {
  const rows = db.query("SELECT id, username, email FROM users WHERE id = ?", [userId]);
  return rows.length ? rows[0] : null;
}

/** Apply a profile edit submitted by the user. */
function updateProfile(userId, data) {
  db.updateUser(userId, data);
}

/** Same edit, but restricted to the customer-editable allowlist. */
function updateProfileSafe(userId, data) {
  const clean = {};
  for (const key of Object.keys(data)) {
    if (EDITABLE_FIELDS.has(key)) {
      clean[key] = data[key];
    }
  }
  if (Object.keys(clean).length === 0) return;
  db.updateUser(userId, clean);
}

module.exports = { searchUsers, getUser, updateProfile, updateProfileSafe, EDITABLE_FIELDS };
