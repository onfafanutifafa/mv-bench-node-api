# mv-bench-node-api

A deliberately vulnerable **Node.js / Express** shop API, used as a known-answer
target for benchmarking security scanners (precision / recall).

It is part of the **mv-bench** corpus:

| Repo | Stack | Purpose |
|------|-------|---------|
| `mv-bench-py-web` | Python · FastAPI | sibling app |
| `mv-bench-node-api` | Node · Express | this app |
| `mv-bench-ai-app` | Python · LLM agent | sibling app |
| `mv-bench-truth` | — | ground-truth labels + scorer for all three |

The planted vulnerabilities are intentionally realistic: most span **multiple
files** (an HTTP route in `src/routes/*` flows through a service in
`src/services/*` into a sink in `src/db.js` / `src/utils/*`), so a scanner has to
trace cross-file data flow rather than pattern-match a single line. The app also
ships **safe decoys** — code that looks dangerous but is correctly defended — so a
scanner that fires on everything is penalised on precision.

> ⚠️ **Do not deploy this.** It exists to be scanned, not run in anger. Dependencies
> are declared but need not be installed; the corpus is static-scanned, never executed.

The location and classification of every planted bug (and every decoy) lives in
[`mv-bench-truth`](https://github.com/onfafanutifafa/mv-bench-truth), kept in a
separate repo on purpose so the answer key never leaks into the code under test.

## Layout

```
src/
  index.js             # Express app + route wiring — the trust boundary
  config.js            # settings
  db.js                # in-memory data-access (raw + parameterized helpers)
  middleware/
    auth.js            # requireUser / requireAdmin middleware
  routes/
    users.js           # user search + profile updates
    orders.js          # checkout, coupons, order lookup, refunds
    files.js           # upload read-back, conversion, preview
    net.js             # outbound fetch + redirect
  services/
    users.js           # user search + profile business logic
    orders.js          # checkout, coupon and refund logic
    files.js           # file read-back + document conversion
    net.js             # outbound fetch + redirect resolution
  utils/
    crypto.js          # password hashing + token generation
```
