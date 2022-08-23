const express = require('express');

const router = express.Router();

const getDashBoard = require('routes/log/getDashBoard');
const updatePageView = require('routes/log/updatePageView');
const getShoppingLogList = require('routes/log/getShoppingLogList');
const getShoppingLog = require('routes/log/getShoppingLog');
const isLoggedIn = require('middlewares/isLoggedIn');

// 대시보드 정보
router.use('/getDashBoard', getDashBoard);
// 페이지뷰 업데이트
router.use('/updatePageView', isLoggedIn, updatePageView);
// 지난 구매 내역
router.use('/getShoppingLogList', isLoggedIn, getShoppingLogList);
router.use('/getShoppingLog', isLoggedIn, getShoppingLog);

module.exports = router;
