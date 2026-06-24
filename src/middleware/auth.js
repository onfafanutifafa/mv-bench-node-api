"use strict";

/**
 * Minimal session/auth middleware.
 *
 * A real deployment would verify a signed JWT; here the caller is resolved from
 * a base64 'uid:role' bearer token to keep the sample importable without extra
 * dependencies. The shape is what matters: a requireUser middleware that routes
 * attach to protect their handlers.
 */

const db = require("../db");

function loadUser(userId) {
  const row = db.getUserRow(userId);
  if (!row) return null;
  return { id: row.id, username: row.username, email: row.email, role: row.role };
}

/**
 * Express middleware: resolve req.user from an 'Authorization: Bearer <b64
 * uid:role>' header. Responds 401 when the header is absent or malformed.
 */
function requireUser(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/, "").trim();
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const uidStr = decoded.split(":", 1)[0];
    const user = loadUser(Number(uidStr));
    if (!user) {
      return res.status(401).json({ error: "unknown user" });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "bad token" });
  }
}

/** Reject the request unless the resolved user has the admin role. */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "admin only" });
  }
  return next();
}

module.exports = { requireUser, requireAdmin };
