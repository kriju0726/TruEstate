const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const metadataController = require('../controllers/metadataController');

router.get('/transactions', transactionsController.list);
router.get('/metadata', metadataController.get);

module.exports = router;
