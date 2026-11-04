const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../public/sales.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// Runs the page script against a fake DOM and fake fetch; no browser is involved.
async function renderPage(fetchImpl) {
  const elements = {};
  const rows = [];
  const document = {
    getElementById: (id) => (elements[id] ??= { textContent: '-' }),
    querySelector: () => ({ appendChild: (row) => rows.push(row) }),
    createElement: () => ({ innerHTML: '' }),
  };
  const context = vm.createContext({ document, fetch: fetchImpl });
  vm.runInContext(script, context);
  await new Promise((resolve) => setTimeout(resolve, 20));
  return {
    total: document.getElementById('total-revenue').textContent,
    average: document.getElementById('average-order-value').textContent,
  };
}

const okResponse = (body) => () =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });

test('page shows $0.00 for a zero average order value', async () => {
  const page = await renderPage(okResponse({ orders: [], totalRevenue: 0, averageOrderValue: 0 }));

  assert.equal(page.average, '$0.00');
});

test('page shows the average order value next to the total', async () => {
  const page = await renderPage(
    okResponse({ orders: [], totalRevenue: 104.47, averageOrderValue: 34.82 }),
  );

  assert.equal(page.total, '$104.47');
  assert.equal(page.average, '$34.82');
});

test('page keeps the placeholder when the response has no averageOrderValue', async () => {
  const page = await renderPage(okResponse({ orders: [], totalRevenue: 10 }));

  assert.equal(page.total, '$10.00');
  assert.equal(page.average, '-');
});

test('page shows Unavailable when the API returns an error status', async () => {
  const page = await renderPage(() =>
    Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error('no body')) }),
  );

  assert.equal(page.total, 'Unavailable');
  assert.equal(page.average, 'Unavailable');
});

test('page shows Unavailable when the request fails', async () => {
  const page = await renderPage(() => Promise.reject(new Error('network down')));

  assert.equal(page.average, 'Unavailable');
});
