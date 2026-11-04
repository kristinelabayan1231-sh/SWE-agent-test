const express = require('express');
const router = express.Router();

// Sample orders — stands in for what would normally come from a database.
const ORDERS = [
  { id: 1, product: 'Widget A', price: 9.99, quantity: 3 },
  { id: 2, product: 'Widget B', price: 24.5, quantity: 1 },
  { id: 3, product: 'Widget C', price: 5.0, quantity: 10 },
];

function calculateTotalRevenue(orders) {
  return orders.reduce((sum, order) => sum + order.price * order.quantity, 0);
}

function calculateAverageOrderValue(orders) {
  if (orders.length === 0) {
    return 0;
  }

  const average = calculateTotalRevenue(orders) / orders.length;

  // EPSILON stops values like 1.005 (stored just under) from rounding down.
  return Math.round((average + Number.EPSILON) * 100) / 100;
}

router.get('/summary', (req, res) => {
  res.json({
    orders: ORDERS,
    totalRevenue: calculateTotalRevenue(ORDERS),
    averageOrderValue: calculateAverageOrderValue(ORDERS),
  });
});

module.exports = router;
module.exports.calculateAverageOrderValue = calculateAverageOrderValue;
