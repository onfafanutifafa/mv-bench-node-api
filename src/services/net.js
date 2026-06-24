"use strict";

/**
 * Outbound network helpers (link previews, redirects).
 */

const axios = require("axios");

const { ALLOWED_FETCH_HOSTS } = require("../config");

/** Fetch a remote URL the user pasted, to build a link preview. */
async function fetchMetadata(url) {
  const resp = await axios.get(url, { timeout: 5000 });
  return { status: resp.status, length: (resp.data || "").length };
}

/** Same preview fetch, restricted to an explicit host allowlist. */
async function fetchMetadataSafe(url) {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch (err) {
    throw new Error("bad url");
  }
  if (!ALLOWED_FETCH_HOSTS.has(host)) {
    throw new Error("host not allowed");
  }
  const resp = await axios.get(url, { timeout: 5000 });
  return { status: resp.status, length: (resp.data || "").length };
}

/** Resolve the post-login redirect target from the 'next' parameter. */
function buildRedirectTarget(nextUrl) {
  return nextUrl;
}

/** Resolve a redirect target, restricted to same-site relative paths. */
function buildRedirectTargetSafe(nextUrl) {
  if (typeof nextUrl === "string" && nextUrl.startsWith("/") && !nextUrl.startsWith("//")) {
    return nextUrl;
  }
  return "/";
}

module.exports = {
  fetchMetadata,
  fetchMetadataSafe,
  buildRedirectTarget,
  buildRedirectTargetSafe,
};
