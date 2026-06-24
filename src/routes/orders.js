"use strict";

/**
 * Order, checkout, coupon and refund routes.
 */

const express = require("express");

const orders = require("../services/orders");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/orders/mine", requireUser, (req, res) => {
  res.json({ orders: orders.listMyOrders(req.user) });
});

router.get("/orders/:id", requireUser, (req, res) => {
  const order = orders.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "not found" });
  }
  return res.json(order);
});

router.post("/orders/checkout", requireUser, (req, res) => {
  const order = orders.checkout(req.user, req.body.items || [], req.body.discount_cents || 0);
  res.json({ order, balance_cents: req.user.balance_cents });
});

router.post("/coupons/apply", requireUser, (req, res) => {
  const newTotal = orders.applyCoupon(req.user, req.body.code, req.body.subtotal_cents);
  res.json({ subtotal_cents: newTotal });
});

router.post("/coupons/redeem", requireUser, (req, res) => {
  const newTotal = orders.redeemCouponOnce(req.user, req.body.code, req.body.subtotal_cents);
  res.json({ subtotal_cents: newTotal });
});

router.post("/orders/:id/refund", requireUser, (req, res) => {
  const result = orders.refundOrder(req.user, req.params.id);
  res.json(result);
});

module.exports = router;
