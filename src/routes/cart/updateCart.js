const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      receiptList,
      ingredientList,
      searchCount,
    } = req.body;

    const created = new Date().getTime();

    const accessToken = req.headers['access-token'];
    const decoded = verifyToken(accessToken);

    const dynamodb = new AWS.DynamoDB();

    const putParams = {
      TableName: 'shoppingLog',
      ReturnConsumedCapacity: 'TOTAL',
      Item: {
        userId: {
          S: decoded.userId,
        },
        created: {
          N: `${created}`,
        },
        receiptList: {
          S: JSON.stringify(receiptList),
        },
        ingredientList: {
          S: JSON.stringify(ingredientList),
        },
      },
    };

    const getParams = {
      TableName: 'user',
      Key: {
        userId: {
          S: decoded.userId,
        },
      },
    };

    const { Item } = await dynamodb.getItem(getParams).promise();
    const totalServiceCount = parseInt(Item.totalServiceCount.N, 10);
    const avgAccuracy = parseFloat(Item.avgAccuracy.N);

    // eslint-disable-next-line max-len
    const newAvgAccuracy = (((avgAccuracy * totalServiceCount) + searchCount) / (totalServiceCount + 1)).toFixed(1);

    const updateParams = {
      ...getParams,
      UpdateExpression: 'set totalServiceCount = :tsc, avgAccuracy = :avga',
      ExpressionAttributeValues: {
        ':tsc': {
          N: `${totalServiceCount + 1}`,
        },
        ':avga': {
          N: `${newAvgAccuracy}`,
        },
      },
    };

    await Promise.all([
      dynamodb.putItem(putParams).promise(),
      dynamodb.updateItem(updateParams).promise(),
    ]);

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
