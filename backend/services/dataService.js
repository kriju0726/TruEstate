// backend/services/dataService.js
const fs = require('fs');
const csv = require('csv-parser');

let transactions = [];

/* -------------------------------------------------
   NORMALIZATION — same logic that we used earlier
------------------------------------------------- */
function normalizeRecord(rec, idx) {
  const total_amount = rec['Total Amount'] ? Number(rec['Total Amount']) :
                      rec['Total'] ? Number(rec['Total']) : 0;

  const final_amount = rec['Final Amount'] ? Number(rec['Final Amount']) : total_amount;

  const quantity = rec['Quantity'] ? Number(rec['Quantity']) :
                   rec['Qty'] ? Number(rec['Qty']) : 0;

  const tags = rec['Tags']
    ? (typeof rec['Tags'] === 'string'
        ? rec['Tags'].split('|').map(t => t.trim())
        : [])
    : [];

  const date = rec['Date']
    ? new Date(rec['Date'])
    : rec['date']
    ? new Date(rec['date'])
    : null;

  return {
    transaction_id: rec['Transaction ID'] || rec['Order ID'] || `TX${idx + 1}`,
    customer_id: rec['Customer ID'] || '',
    customer_name: rec['Customer Name'] || '',
    phone: rec['Phone Number'] || '',
    gender: rec['Gender'] || '',
    age: rec['Age'] ? Number(rec['Age']) : null,
    customer_region: rec['Customer Region'] || '',
    product_category: rec['Product Category'] || '',
    tags,
    quantity,
    total_amount,
    final_amount,
    total_discount: total_amount - final_amount,
    date,
    payment_method: rec['Payment Method'] || '',
    employee_name: rec['Employee Name'] || '',
  };
}

/* -------------------------------------------------
   LOAD CSV — From URL (CSV_URL) or fallback local
------------------------------------------------- */
async function loadCSV(localPath) {
  // 1️⃣ Prefer loading from CSV_URL (GitHub release, Dropbox etc.)
  if (process.env.CSV_URL) {
    const url = process.env.CSV_URL;

    console.log("CSV_URL detected. Fetching CSV from:");
    console.log(url);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to download CSV: ${res.status} ${res.statusText}`);
    }

    return new Promise((resolve, reject) => {
      const results = [];
      let idx = 0;

      const stream = res.body; // ReadableStream
      stream
        .pipe(csv())
        .on('data', (row) => {
          try {
            results.push(normalizeRecord(row, idx));
            idx++;

            if (idx % 50000 === 0) {
              console.log(`Parsed ${idx} rows...`);
            }
          } catch (err) {
            // ignore bad row
          }
        })
        .on('end', () => {
          transactions = results;
          console.log(`\n✔ CSV Loaded successfully from URL`);
          console.log(`✔ Total Records: ${transactions.length}\n`);
          resolve();
        })
        .on('error', (err) => {
          console.error("CSV parse error:", err);
          reject(err);
        });
    });
  }

  // 2️⃣ Fallback: local file (not used on Render, but kept for local dev)
  console.log("No CSV_URL detected — trying local file:", localPath);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(localPath)) {
      return reject(new Error("CSV not found locally at: " + localPath));
    }

    const results = [];
    let idx = 0;

    fs.createReadStream(localPath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(normalizeRecord(row, idx));
        idx++;
        if (idx % 50000 === 0) {
          console.log(`Parsed ${idx} rows...`);
        }
      })
      .on('end', () => {
        transactions = results;
        console.log(`Loaded ${transactions.length} transactions from local file`);
        resolve();
      })
      .on('error', reject);
  });
}

/* -------------------------------------------------
   SIMPLE IN-MEMORY GETTER
------------------------------------------------- */
function getAll() {
  return transactions;
}

/* -------------------------------------------------
   METADATA BUILDER
------------------------------------------------- */
function uniqueValues(key) {
  const set = new Set();
  transactions.forEach((t) => {
    const v = t[key];
    if (v == null) return;

    if (Array.isArray(v)) {
      v.forEach((x) => set.add(x));
    } else {
      set.add(v);
    }
  });
  return Array.from(set).sort();
}

function metadata() {
  return {
    customer_regions: uniqueValues('customer_region'),
    genders: uniqueValues('gender'),
    product_categories: uniqueValues('product_category'),
    tags: uniqueValues('tags'),
    payment_methods: uniqueValues('payment_method'),
    age_min: transactions.reduce(
      (m, t) => (t.age != null ? Math.min(m, t.age) : m),
      Infinity
    ),
    age_max: transactions.reduce(
      (m, t) => (t.age != null ? Math.max(m, t.age) : m),
      -Infinity
    ),
  };
}

/* -------------------------------------------------
   EXPORTS
------------------------------------------------- */
module.exports = {
  loadCSV,
  getAll,
  metadata,
};
