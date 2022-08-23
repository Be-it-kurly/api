const express = require('express');
const verifyToken = require('utils/verifyToken');
const AWS = require('aws-sdk');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      isInit = '0',
    } = req.body;

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

    const tempPageView = parseInt(Item.tempPageView.N, 10);
    const avgPageView = parseInt(Item.avgPageView.N, 10);
    const totalServiceCount = parseInt(Item.totalServiceCount.N, 10);

    if (isInit === '0') {
      const newTempPageView = tempPageView + 1;
      const updateParams = {
        ...params,
        UpdateExpression: 'set tempPageView = :tpv',
        ExpressionAttributeValues: {
          ':tpv': {
            N: `${newTempPageView}`,
          },
        },
      };
      await dynamodb.updateItem(updateParams).promise();
      res.status(200).json({
        success: true,
        data: {
          userId: decoded.userId,
          tempPageView: newTempPageView,
          avgPageView,
        },
      });
    } else {
      // eslint-disable-next-line max-len
      const newAvgPV = (((totalServiceCount * avgPageView) + tempPageView) / (totalServiceCount + 1)).toFixed(1);
      const updateParams = {
        ...params,
        UpdateExpression: 'set tempPageView = :tpv, avgPageView = :apv',
        ExpressionAttributeValues: {
          ':tpv': {
            N: '0',
          },
          ':apv': {
            N: `${newAvgPV}`,
          },
        },
      };
      await dynamodb.updateItem(updateParams).promise();
      res.status(200).json({
        success: true,
        data: {
          userId: decoded.userId,
          tempPageView: 0,
          avgPageView: parseInt(newAvgPV, 10),
        },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
