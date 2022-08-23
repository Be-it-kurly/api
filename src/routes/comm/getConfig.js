const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');
const { KEYWORDS } = require('configs/vars');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
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

    const userKeywords = {
      taste: [],
      cusine: [],
      foodType: [],
    };
    if ((Item.keywords && Item.keywords.S)) {
      Item.keywords.S.split(',').forEach((word) => {
        if (KEYWORDS.taste.includes(word)) {
          userKeywords.taste.push(word);
        } else if (KEYWORDS.cusine.includes(word)) {
          userKeywords.cusine.push(word);
        } else if (KEYWORDS.foodType.includes(word)) {
          userKeywords.foodType.push(word);
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userKeywords,
        defaultKeywords: KEYWORDS,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
