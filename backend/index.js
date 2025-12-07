const express = require('express');
const cors = require('cors');
const api = require('./routes/api');
const dataService = require('./services/dataService');

const app = express();
app.use(cors());
app.use(express.json());

async function start() {
  try {
    await dataService.loadCSV('./data/sales.csv');
    app.use('/api', api);
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start backend:', err.message || err);
    process.exit(1);
  }
}

start();
