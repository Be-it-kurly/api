const express = require('express');

const router = express.Router();

const getRecommendAccuracy = require('routes/log/getRecommendAccuracy');
const getRecommendCount = require('routes/log/getRecommendCount');
const updatePageView = require('routes/log/updatePageView');
const getShoppingLogList = require('routes/log/getShoppingLogList');
const getShoppingLog = require('routes/log/getShoppingLog');
const isLoggedIn = require('middlewares/isLoggedIn');

// 추천 정확도
router.use('/getRecommendAccuracy', getRecommendAccuracy);
// 추천 조회수
router.use('/getRecommendCount', getRecommendCount);
// 페이지뷰 업데이트
router.use('/updatePageView', isLoggedIn, updatePageView);
// 지난 구매 내역
router.use('/getShoppingLogList', isLoggedIn, getShoppingLogList);
router.use('/getShoppingLog', isLoggedIn, getShoppingLog);

module.exports = router;
