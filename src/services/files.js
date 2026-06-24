"use strict";

/**
 * User file storage helpers.
 */

const fs = require("fs");
const path = require("path");
const { execFile, exec } = require("child_process");

const { UPLOAD_DIR } = require("../config");

// Templates the convert endpoint is allowed to render.
const ALLOWED_TEMPLATES = new Set(["invoice.html", "receipt.html", "label.html"]);

/** Read back a file the user previously uploaded, by relative path. */
function readUserFile(relPath) {
  const full = path.join(UPLOAD_DIR, relPath);
  return fs.readFileSync(full);
}

/** Convert an uploaded document to PDF via the system LibreOffice. */
function convertToPdf(name) {
  return new Promise((resolve) => {
    exec("libreoffice --headless --convert-to pdf " + name, (err) => {
      resolve(err ? err.code || 1 : 0);
    });
  });
}

/** Read a known template file, validated against an allowlist first. */
function readTemplate(name) {
  if (!ALLOWED_TEMPLATES.has(name)) {
    throw new Error("unknown template");
  }
  const full = path.join(UPLOAD_DIR, "templates", name);
  return fs.readFileSync(full);
}

/** Produce a thumbnail for an uploaded image using a fixed-argument call. */
function makeThumbnail(name) {
  return new Promise((resolve) => {
    const src = path.join(UPLOAD_DIR, "thumbs", path.basename(name));
    execFile("convert", [src, "-resize", "128x128", src + ".thumb.png"], (err) => {
      resolve(err ? err.code || 1 : 0);
    });
  });
}

module.exports = { readUserFile, convertToPdf, readTemplate, makeThumbnail, ALLOWED_TEMPLATES };
