const dataService = require('../services/dataService');

exports.get = (req, res) => {
  try {
    const md = dataService.metadata();
    if (!isFinite(md.age_min)) md.age_min = null;
    if (!isFinite(md.age_max)) md.age_max = null;
    res.json(md);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get metadata' });
  }
};
