const express = require('express');

const router = express.Router();

const getReceiptList = require('routes/cart/getReceiptList');
const getAvgPrice = require('routes/cart/getAvgPrice');
const updateCart = require('routes/cart/updateCart');
const isLoggedIn = require('middlewares/isLoggedIn');

// 레시피 리스트
router.use('/getReceiptList', isLoggedIn, getReceiptList);

// 유사 집단 가격
router.use('/getAvgPrice', isLoggedIn, getAvgPrice);

// 장바구니 구매완료
router.use('/updateCart', isLoggedIn, updateCart);

module.exports = router;
