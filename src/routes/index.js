const express = require('express');

const router = express.Router();

const logRouter = require('routes/log');
const cartRouter = require('routes/cart');
const fcmRouter = require('routes/fcm');
const commRouter = require('routes/comm');
const userRouter = require('routes/user');

router.use('/log', logRouter);
router.use('/cart', cartRouter);
router.use('/fcm', fcmRouter);
router.use('/comm', commRouter);
router.use('/user', userRouter);

module.exports = router;
