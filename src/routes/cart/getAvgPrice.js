const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      headcount,
      mealTime,
      days,
    } = req.query;
    const accessToken = req.headers['access-token'];
    const decoded = verifyToken(accessToken);
    const dynamodb = new AWS.DynamoDB();

    const params = {
      TableName: 'user',
      Key: {
        userId: {
          S: decoded.userId,
        },
      },
    };

    const { Item } = await dynamodb.getItem(params).promise();

    // 지난 구매 내역 기준
    const priceAtOnceByShoppingLog = parseInt(Item.priceAtOnceByShoppingLog.N, 10);

    // 비슷한 구매 패턴 기준
    const priceAtOnceByPattern = parseInt(Item.priceAtOnceByPattern.N, 10);

    const count = parseInt(headcount, 10) * (mealTime.split(',').length) * parseInt(days, 10);

    return res.status(200).json({
      success: true,
      data: {
        totalPriceByShoppingLog: priceAtOnceByShoppingLog * count,
        totalPriceByPattern: priceAtOnceByPattern * count,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
