const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dynamodb = new AWS.DynamoDB();

    const params = {
      TableName: 'user',
    };

    const { Items } = await dynamodb.scan(params).promise();

    const list = Items.map((v) => ({
      userId: v.userId.S,
      userName: v.userName.S,
      age: parseInt(v.age.N, 10),
      totalServiceCount: parseInt(v.totalServiceCount.N, 10),
      keywords: v.keywords.S,
    }));

    res.status(200).json({
      success: true,
      data: {
        userList: [...list],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
