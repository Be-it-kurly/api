const express = require('express');

const router = express.Router();

const getConfig = require('routes/comm/getConfig');
const isLoggedIn = require('middlewares/isLoggedIn');

router.use('/getConfig', isLoggedIn, getConfig);

module.exports = router;
