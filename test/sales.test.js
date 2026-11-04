const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const salesRoute = require('../routes/sales');

async function fetchSalesSummary() {
  const app = express();
  app.use('/api/sales', salesRoute);
  const server = await new Promise((resolve) => {
    const listeningServer = app.listen(0, () => resolve(listeningServer));
  });

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/sales/summary`);
    return await response.json();
  } finally {
    server.close();
  }
}

test('total revenue multiplies each order price by its quantity', async () => {
  const { totalRevenue } = await fetchSalesSummary();

  // 9.99 * 3 + 24.5 * 1 + 5.0 * 10, compared in cents to ignore float rounding.
  assert.equal(Math.round(totalRevenue * 100), 10447);
});

test('summary returns average order value per order, not per unit', async () => {
  const { averageOrderValue } = await fetchSalesSummary();

  // 104.47 revenue / 3 orders = 34.8233..., rounded to 2 decimals.
  assert.equal(averageOrderValue, 34.82);
});

test('average order value is 0 when there are no orders', () => {
  assert.equal(salesRoute.calculateAverageOrderValue([]), 0);
});

test('average order value rounds a half cent up', () => {
  const orders = [
    { price: 2.01, quantity: 1 },
    { price: 0, quantity: 1 },
  ];

  // 2.01 / 2 = 1.005, which is stored as slightly less than 1.005.
  assert.equal(salesRoute.calculateAverageOrderValue(orders), 1.01);
});
