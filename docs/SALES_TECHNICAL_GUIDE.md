# Sales Report — Technical Guide

## Files
- `routes/sales.js` — `/api/sales/summary` endpoint, order data, revenue calculation.
- `public/sales.html` — renders the orders table and total revenue.

## Data flow
`GET /api/sales/summary` returns `{ orders, totalRevenue }`. `orders` is a fixed in-memory
array in this test app (would be a DB query in a real app). `totalRevenue` is computed by
`calculateTotalRevenue()` in `routes/sales.js`.

## Business rule
Total Revenue = sum of `(price * quantity)` across all orders.
