const express = require('express');

const router = express.Router();

const sendFcm = require('routes/fcm/send');

router.use('/send', sendFcm);

module.exports = router;
