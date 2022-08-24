const express = require('express');

const router = express.Router();

const getConfig = require('routes/comm/getConfig');
const createReceipt = require('routes/comm/createReceipt');
const isLoggedIn = require('middlewares/isLoggedIn');

router.use('/getConfig', isLoggedIn, getConfig);
router.use('/createReceipt', createReceipt);

module.exports = router;
