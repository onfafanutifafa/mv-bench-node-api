"use strict";

/**
 * File download, conversion and preview routes.
 */

const express = require("express");

const files = require("../services/files");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/files/download", requireUser, (req, res) => {
  const data = files.readUserFile(req.query.path || "");
  res.json({ bytes: data.length });
});

router.post("/files/convert", requireUser, async (req, res) => {
  const code = await files.convertToPdf(req.body.name);
  res.json({ exit_code: code });
});

router.post("/files/thumbnail", requireUser, async (req, res) => {
  const code = await files.makeThumbnail(req.body.name);
  res.json({ exit_code: code });
});

router.get("/files/preview", requireUser, (req, res) => {
  let caption = req.query.caption || "";
  caption = caption.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
  res.set("Content-Type", "text/html");
  res.send("<div class=\"preview\"><h2>Preview</h2><p>" + caption + "</p></div>");
});

module.exports = router;