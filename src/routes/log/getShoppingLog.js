const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      created,
    } = req.query;

    const accessToken = req.headers['access-token'];
    const decoded = verifyToken(accessToken);

    const dynamodb = new AWS.DynamoDB();

    const params = {
      TableName: 'shoppingLog',
      Key: {
        userId: {
          S: decoded.userId,
        },
        created: {
          N: created,
        },
      },
    };

    const { Item } = await dynamodb.getItem(params).promise();

    res.status(200).json({
      success: true,
      data: {
        log: {
          created: parseInt(Item.created.N, 10),
          receiptList: JSON.parse(Item.receiptList.S),
          ingredientList: JSON.parse(Item.ingredientList.S),
          userId: Item.userId.S,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
