const express = require('express');

const router = express.Router();
const AWS = require('aws-sdk');

router.post('/', async (req, res) => {
  try {
    const dynamodb = new AWS.DynamoDB();

    const {
      receiptId,
      recipeName,
      keyword,
      headcount,
      mealTime,
      difficulty,
      time,
      thumbnail,
      step,
      totalPrice,
      requirements,
    } = req.body;

    const params = {
      Item: {
        receiptId: {
          S: receiptId,
        },
        recipeName: {
          S: recipeName,
        },
        keyword: {
          S: keyword,
        },
        headcount: {
          N: `${headcount}`,
        },
        mealTime: {
          S: mealTime,
        },
        difficulty: {
          S: difficulty,
        },
        time: {
          N: `${time}`,
        },
        thumbnail: {
          S: thumbnail,
        },
        step: {
          S: step,
        },
        totalPrice: {
          N: `${totalPrice}`,
        },
        requirements: {
          S: JSON.stringify(requirements),
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'receipt',
    };
    await dynamodb.putItem(params).promise();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
});

module.exports = router;
