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

    console.log(Items);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
