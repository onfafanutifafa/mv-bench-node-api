"use strict";

/**
 * User and profile routes.
 *
 * Handlers pull inputs off the request and hand them to the user service.
 */

const express = require("express");

const users = require("../services/users");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/users/search", requireUser, (req, res) => {
  const results = users.searchUsers(req.query.q || "");
  res.json({ results });
});

router.get("/users/:id", requireUser, (req, res) => {
  const user = users.getUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "not found" });
  }
  return res.json(user);
});

router.patch("/profile", requireUser, (req, res) => {
  users.updateProfile(req.user.id, req.body);
  res.json({ ok: true });
});

router.put("/profile/settings", requireUser, (req, res) => {
  users.updateProfileSafe(req.user.id, req.body);
  res.json({ ok: true });
});

module.exports = router;
