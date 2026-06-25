"use strict";

/**
 * Outbound fetch and redirect routes.
 */

const express = require("express");

const net = require("../services/net");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/fetch", requireUser, async (req, res) => {
  try {
    const meta = await net.fetchMetadata(req.query.url);
    res.json(meta);
  } catch (err) {
    res.status(502).json({ error: "fetch failed" });
  }
});

router.get("/fetch/cdn", requireUser, async (req, res) => {
  try {
    const meta = await net.fetchMetadataSafe(req.query.url);
    res.json(meta);
  } catch (err) {
    res.status(400).json({ error: String(err.message) });
  }
});

router.get("/go", (req, res) => {
  res.redirect(net.buildRedirectTargetSafe(req.query.next));
});

router.get("/go/safe", (req, res) => {
  res.redirect(net.buildRedirectTargetSafe(req.query.next));
});

module.exports = router;