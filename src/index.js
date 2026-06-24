"use strict";

/**
 * Shop API — Express entry point.
 *
 * Routes are thin: they pull request inputs and hand them to the service layer.
 * The interesting behaviour lives in src/services and src/utils; this file is
 * the trust boundary where untrusted input enters and the routers are wired up.
 */

const express = require("express");
const cors = require("cors");

const { requireUser } = require("./middleware/auth");
const crypto = require("./utils/crypto");
const users = require("./services/users");
const orders = require("./services/orders");

const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const filesRouter = require("./routes/files");
const netRouter = require("./routes/net");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(usersRouter);
app.use(ordersRouter);
app.use(filesRouter);
app.use(netRouter);

app.get("/admin/stats", (req, res) => {
  const revenue = Object.values(orders.ORDERS).reduce((sum, o) => sum + o.total_cents, 0);
  res.json({ users: users.searchUsers(""), revenue_cents: revenue });
});

app.get("/admin/audit", requireUser, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin only" });
  }
  return res.json({ orders: Object.values(orders.ORDERS) });
});

app.post("/auth/reset-token", (req, res) => {
  res.json({ token: crypto.generateResetToken() });
});

app.post("/auth/session", (req, res) => {
  res.json({ token: crypto.generateSessionToken() });
});

module.exports = app;
