const dataService = require('../services/dataService');

function matchesSearch(record, q) {
  if (!q) return true;
  q = q.trim().toLowerCase();
  return (record.customer_name && record.customer_name.toLowerCase().includes(q))
    || (record.phone && record.phone.toLowerCase().includes(q));
}

function matchesFilters(rec, filters) {
  if (filters.regions && filters.regions.length && !filters.regions.includes(rec.customer_region)) return false;
  if (filters.genders && filters.genders.length && !filters.genders.includes(rec.gender)) return false;
  if (filters.ageMin != null && (rec.age == null || rec.age < filters.ageMin)) return false;
  if (filters.ageMax != null && (rec.age == null || rec.age > filters.ageMax)) return false;
  if (filters.categories && filters.categories.length && !filters.categories.includes(rec.product_category)) return false;
  if (filters.tags && filters.tags.length) {
    if (!rec.tags || !rec.tags.some(t => filters.tags.includes(t))) return false;
  }
  if (filters.paymentMethods && filters.paymentMethods.length && !filters.paymentMethods.includes(rec.payment_method)) return false;
  if (filters.dateFrom && rec.date && rec.date < new Date(filters.dateFrom)) return false;
  if (filters.dateTo && rec.date && rec.date > new Date(filters.dateTo)) return false;
  return true;
}

function compareBy(sortBy, a, b) {
  if (sortBy === 'date_desc') {
    return (b.date || 0) - (a.date || 0);
  } else if (sortBy === 'quantity') {
    return (b.quantity || 0) - (a.quantity || 0);
  } else if (sortBy === 'customer_asc') {
    return (a.customer_name || '').localeCompare(b.customer_name || '');
  }
  return 0;
}

function computeSummary(items) {
  const units = items.reduce((s, it) => s + (it.quantity || 0), 0);
  const totalAmount = items.reduce((s, it) => s + (it.final_amount || 0), 0);
  const totalDiscount = items.reduce((s, it) => s + (it.total_discount || 0), 0);
  return { units_sold: units, total_amount: totalAmount, total_discount: totalDiscount, records: items.length };
}

exports.list = (req, res) => {
  const {
    q,
    page = 1,
    pageSize = 10,
    sort = 'date_desc',
    regions, genders, ageMin, ageMax, categories, tags, paymentMethods, dateFrom, dateTo,
    summaryOnly
  } = req.query;

  const filters = {
    regions: regions ? regions.split(',').filter(Boolean) : [],
    genders: genders ? genders.split(',').filter(Boolean) : [],
    ageMin: ageMin ? Number(ageMin) : null,
    ageMax: ageMax ? Number(ageMax) : null,
    categories: categories ? categories.split(',').filter(Boolean) : [],
    tags: tags ? tags.split(',').filter(Boolean) : [],
    paymentMethods: paymentMethods ? paymentMethods.split(',').filter(Boolean) : [],
    dateFrom: dateFrom || null,
    dateTo: dateTo || null
  };

  let items = dataService.getAll();

  items = items.filter(i => matchesSearch(i, q));
  items = items.filter(i => matchesFilters(i, filters));

  const summary = computeSummary(items);
  if (summaryOnly === 'true') {
    return res.json({ summary });
  }

  items = items.sort((a,b) => compareBy(sort, a, b));

  const total = items.length;
  const p = Math.max(1, Number(page));
  const ps = Math.max(1, Number(pageSize));
  const start = (p-1)*ps;
  const paged = items.slice(start, start+ps);

  res.json({
    page: p,
    pageSize: ps,
    total,
    totalPages: Math.ceil(total/ps),
    summary,
    data: paged
  });
};
