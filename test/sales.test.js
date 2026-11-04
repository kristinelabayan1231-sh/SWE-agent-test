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
