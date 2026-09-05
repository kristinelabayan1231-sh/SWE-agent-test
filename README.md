# SWE-agent-test

A tiny dummy app used to test an AI bug-fixing agent end to end: file a "ticket" describing
a bug, have the agent find the root cause in this repo and produce a fix, review the diff.

## Run it

```bash
npm install
npm start
# http://localhost:3000/sales.html
```

## Known bug (seeded for testing)

The Sales Report's "Total Revenue" figure is wrong for any order with quantity > 1 — it
sums each order's unit price but ignores quantity. See `docs/SALES_TECHNICAL_GUIDE.md` for
the intended business rule.
