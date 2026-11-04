# Sales Report — Technical Guide

## Files
- `routes/sales.js` — `/api/sales/summary` endpoint, order data, revenue calculation.
- `public/sales.html` — renders the orders table and total revenue.

## Data flow
`GET /api/sales/summary` returns `{ orders, totalRevenue, averageOrderValue }`. `orders` is a
fixed in-memory array in this test app (would be a DB query in a real app). `totalRevenue` and
`averageOrderValue` are computed by `calculateTotalRevenue()` and
`calculateAverageOrderValue()` in `routes/sales.js`.

## Business rule
Total Revenue = sum of `(price * quantity)` across all orders.

Average Order Value = Total Revenue / number of orders (not units), rounded to 2 decimal
places. It is 0 when there are no orders.
