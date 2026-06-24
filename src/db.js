"use strict";

/**
 * Thin in-memory data-access layer.
 *
 * The store stands in for a SQL database: rows live in plain arrays and the two
 * query helpers mimic the two ways a SQL driver is typically called — one that
 * runs a fully-formed string, and one that binds parameters. Callers pick which
 * to use.
 */

const users = [
  { id: 1, username: "alice", email: "alice@example.com", role: "customer", balance_cents: 0 },
  { id: 2, username: "bob", email: "bob@example.com", role: "customer", balance_cents: 0 },
  { id: 3, username: "root", email: "root@example.com", role: "admin", balance_cents: 0 },
];

/**
 * Execute a fully-formed query string against the user table.
 *
 * Supports the small subset the app needs: a username LIKE filter and an id
 * equality filter. The caller is responsible for having built the string.
 */
function queryRaw(sql) {
  const likeMatch = sql.match(/username LIKE '%(.*)%'/);
  if (likeMatch) {
    const needle = likeMatch[1].toLowerCase();
    return users
      .filter((u) => u.username.toLowerCase().includes(needle))
      .map((u) => ({ id: u.id, username: u.username, email: u.email }));
  }
  const idMatch = sql.match(/id\s*=\s*(\d+)/);
  if (idMatch) {
    const id = Number(idMatch[1]);
    return users.filter((u) => u.id === id).map((u) => ({ id: u.id, username: u.username, email: u.email }));
  }
  return users.map((u) => ({ id: u.id, username: u.username, email: u.email }));
}

/**
 * Execute a parameterized statement — placeholders are bound to params here
 * rather than spliced into the string.
 */
function query(sql, params = []) {
  if (/WHERE id = \?/.test(sql)) {
    const id = Number(params[0]);
    return users
      .filter((u) => u.id === id)
      .map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role }));
  }
  if (/username LIKE \?/.test(sql)) {
    const needle = String(params[0]).replace(/%/g, "").toLowerCase();
    return users
      .filter((u) => u.username.toLowerCase().includes(needle))
      .map((u) => ({ id: u.id, username: u.username, email: u.email }));
  }
  return [];
}

/** Apply a set of column updates to one user row, by bound id. */
function updateUser(userId, columns) {
  const row = users.find((u) => u.id === Number(userId));
  if (!row) return;
  Object.assign(row, columns);
}

function getUserRow(userId) {
  return users.find((u) => u.id === Number(userId)) || null;
}

function allUsers() {
  return users.map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role }));
}

module.exports = { queryRaw, query, updateUser, getUserRow, allUsers };
