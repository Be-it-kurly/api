const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dynamodb = new AWS.DynamoDB();

    const [qUser, qLog] = await Promise.all([
      dynamodb.scan({
        TableName: 'user',
      }).promise(),
      dynamodb.scan({
        TableName: 'shoppingLog',
      }).promise(),
    ]);

    let totalServiceCount = 0;
    let totalAvgAccuracy = 0;
    let totalAvgPageView = 0;
    const weeklyServiceCount = [];

    const time = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const tempTime = new Date(time.getFullYear(), time.getMonth(), time.getDate() - i);

      weeklyServiceCount.push({
        label: `${tempTime.getMonth() + 1}.${tempTime.getDate()}`,
        count: 0,
      });
    }

    qUser.Items.forEach((u) => {
      totalServiceCount += parseInt(u.totalServiceCount.N, 10);
      totalAvgAccuracy += parseInt(u.avgAccuracy.N, 10);
      totalAvgPageView += parseInt(u.avgPageView.N, 10);
    });

    qLog.Items.forEach((l) => {
      const created = parseInt(l.created.N, 10);

      const targetIdx = weeklyServiceCount.findIndex((data) => {
        const tsToDate = new Date(created);
        if (data.label === `${tsToDate.getMonth() + 1}.${tsToDate.getDate()}`) {
          return true;
        }
        return false;
      });

      if (targetIdx !== -1) {
        weeklyServiceCount[targetIdx] = {
          ...weeklyServiceCount[targetIdx],
          count: weeklyServiceCount[targetIdx] && typeof weeklyServiceCount[targetIdx].count === 'number'
            ? weeklyServiceCount[targetIdx].count + 1
            : 1,
        };
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalServiceCount,
        avgAccuracy: (totalAvgAccuracy / (qUser.Items.length)).toFixed(1),
        avgPageView: (totalAvgPageView / (qUser.Items.length)).toFixed(1),
        weeklyServiceCount,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
