const express = require('express');
const path = require('path');
const salesRoute = require('./routes/sales');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/sales', salesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SWE-agent-test running on http://localhost:${PORT}`);
});
