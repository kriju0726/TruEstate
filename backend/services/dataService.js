const fs = require('fs');
const csv = require('csv-parser');

let transactions = [];

function normalizeRecord(rec, idx) {
  const total_amount = rec['Total Amount'] ? Number(rec['Total Amount']) : (rec['Total'] ? Number(rec['Total']) : 0);
  const final_amount = rec['Final Amount'] ? Number(rec['Final Amount']) : total_amount;
  const quantity = rec['Quantity'] ? Number(rec['Quantity']) : (rec['Qty'] ? Number(rec['Qty']) : 0);
  const tags = rec['Tags'] ? (typeof rec['Tags'] === 'string' ? rec['Tags'].split('|').map(t=>t.trim()) : []) : [];
  const date = rec['Date'] ? new Date(rec['Date']) : (rec['date'] ? new Date(rec['date']) : null);

  return {
    transaction_id: rec['Transaction ID'] || rec['Order ID'] || (`TX${idx+1}`),
    customer_id: rec['Customer ID'] || '',
    customer_name: rec['Customer Name'] || '',
    phone: rec['Phone Number'] || '',
    gender: rec['Gender'] || '',
    age: rec['Age'] ? Number(rec['Age']) : null,
    customer_region: rec['Customer Region'] || '',
    customer_type: rec['Customer Type'] || '',
    product_id: rec['Product ID'] || '',
    product_name: rec['Product Name'] || '',
    brand: rec['Brand'] || '',
    product_category: rec['Product Category'] || '',
    tags,
    quantity,
    price_per_unit: rec['Price per Unit'] ? Number(rec['Price per Unit']) : 0,
    discount_percentage: rec['Discount Percentage'] ? Number(rec['Discount Percentage']) : 0,
    total_amount,
    final_amount,
    total_discount: total_amount - final_amount,
    date,
    payment_method: rec['Payment Method'] || '',
    order_status: rec['Order Status'] || '',
    delivery_type: rec['Delivery Type'] || '',
    store_id: rec['Store ID'] || '',
    store_location: rec['Store Location'] || '',
    salesperson_id: rec['Salesperson ID'] || '',
    employee_name: rec['Employee Name'] || ''
  };
}

function loadCSV(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) return reject(new Error('CSV not found: ' + path));
    const results = [];
    let idx = 0;
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(normalizeRecord(data, idx));
        idx++;
      })
      .on('end', () => {
        transactions = results;
        console.log(`Loaded ${transactions.length} transactions`);
        resolve();
      })
      .on('error', reject);
  });
}

function getAll() { return transactions; }

function uniqueValues(key) {
  const set = new Set();
  transactions.forEach(t => {
    const v = t[key];
    if (v == null) return;
    if (Array.isArray(v)) v.forEach(x=>set.add(x));
    else set.add(v);
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
    age_min: transactions.reduce((m, t)=> t.age!=null ? Math.min(m, t.age) : m, Infinity),
    age_max: transactions.reduce((m, t)=> t.age!=null ? Math.max(m, t.age) : -Infinity, -Infinity)
  };
}

module.exports = { loadCSV, getAll, metadata };
