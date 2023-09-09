const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission('0000'));

router.use('/shop', require('./access'));
router.use('/product', require('./product'));

module.exports = router;
