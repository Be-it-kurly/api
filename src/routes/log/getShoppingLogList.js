const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const accessToken = req.headers['access-token'];
    const decoded = verifyToken(accessToken);

    const dynamodb = new AWS.DynamoDB();

    const params = {
      TableName: 'shoppingLog',
      ExpressionAttributeValues: {
        ':uid': {
          S: decoded.userId,
        },
      },
      KeyConditionExpression: 'userId = :uid',
    };

    const { Items } = await dynamodb.query(params).promise();

    const list = Items.map((v) => ({
      created: parseInt(v.created.N, 10),
      receiptList: JSON.parse(v.receiptList.S),
      ingredientList: JSON.parse(v.ingredientList.S),
      userId: v.userId.S,
    }));

    res.status(200).json({ success: true, data: { logList: [...list] } });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
