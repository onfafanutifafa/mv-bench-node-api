"use strict";

/**
 * Order and checkout logic.
 */

const db = require("../db");

// In-memory order book keyed by id, seeded with one order per demo user.
const ORDERS = {
  1001: { id: 1001, user_id: 1, total_cents: 4200, status: "paid", refunded: false },
  1002: { id: 1002, user_id: 2, total_cents: 1500, status: "paid", refunded: false },
};

const COUPONS = {
  WELCOME10: { code: "WELCOME10", percentOff: 10, used: false },
  HALFOFF: { code: "HALFOFF", percentOff: 50, used: false },
};

/** Look up an order by id. */
function getOrder(orderId) {
  return ORDERS[Number(orderId)] || null;
}

/** List only the caller's own orders — the correct, scoped query. */
function listMyOrders(user) {
  return Object.values(ORDERS).filter((o) => o.user_id === user.id);
}

/**
 * Price a cart and create a paid order.
 *
 * items: [{ price_cents, qty }, ...]
 * discountCents: a promotional credit applied to the order total.
 */
function checkout(user, items, discountCents = 0) {
  let subtotal = 0;
  for (const line of items) {
    subtotal += line.price_cents * line.qty;
  }
  let total = subtotal - discountCents;
  if (total < 0) {
    const row = db.getUserRow(user.id);
    if (row) {
      row.balance_cents += -total;
      user.balance_cents = row.balance_cents;
    }
    total = 0;
  }
  const ids = Object.keys(ORDERS).map(Number);
  const orderId = ids.length ? Math.max(...ids) + 1 : 1001;
  const order = { id: orderId, user_id: user.id, total_cents: total, status: "paid", refunded: false };
  ORDERS[orderId] = order;
  return order;
}

/** Apply a discount coupon and return the new subtotal. */
function applyCoupon(user, code, subtotalCents) {
  const coupon = COUPONS[code];
  if (!coupon) {
    return subtotalCents;
  }
  const discount = Math.floor((subtotalCents * coupon.percentOff) / 100);
  return subtotalCents - discount;
}

/** Apply a coupon at most once — the corrected version. */
function redeemCouponOnce(user, code, subtotalCents) {
  const coupon = COUPONS[code];
  if (!coupon || coupon.used) {
    return subtotalCents;
  }
  coupon.used = true;
  const discount = Math.floor((subtotalCents * coupon.percentOff) / 100);
  return subtotalCents - discount;
}

/** Refund a paid order back to the owner's balance. */
function refundOrder(user, orderId) {
  const order = ORDERS[Number(orderId)];
  if (!order) {
    return { ok: false, reason: "not found" };
  }
  const row = db.getUserRow(user.id);
  if (row) {
    row.balance_cents += order.total_cents;
    user.balance_cents = row.balance_cents;
  }
  order.status = "refunded";
  return { ok: true, refunded_cents: order.total_cents };
}

module.exports = {
  ORDERS,
  COUPONS,
  getOrder,
  listMyOrders,
  checkout,
  applyCoupon,
  redeemCouponOnce,
  refundOrder,
};
