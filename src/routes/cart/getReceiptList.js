/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const AWS = require('aws-sdk');

const containKeyword = require('utils/containKeyword');

router.get('/', async (req, res) => {
  try {
    const {
      keyword,
      price,
      headcount,
      mealTime,
      days,
    } = req.query;

    const dynamodb = new AWS.DynamoDB();

    const count = (mealTime.split(',').length) * parseInt(days, 10);
    const totalCount = count * parseInt(headcount, 10);

    // 한 끼 금액
    const priceAtOnce = Math.floor(parseInt(price, 10) / totalCount);

    const params = {
      TableName: 'receipt',
    };

    const {
      Items,
    } = await dynamodb.scan(params).promise();

    const beforeReceipts = Items.filter((v) => containKeyword(v.keyword.S, keyword));

    const receiptList = [];
    const ingredientList = [];
    let totalMealPrice = 0;
    for (let i = 0; i < parseInt(days, 10); i += 1) {
      const receiptPerDay = [];
      // eslint-disable-next-line no-loop-func
      mealTime.split(',').forEach((time) => {
        const receipts = [...beforeReceipts];

        // 식사시간 필터
        const timeFilteredReceipts = receipts
          .filter((filteredItem) => (filteredItem.mealTime.S).split(',').includes(time));

        // 가격 필터
        const priceFilteredReceipts = timeFilteredReceipts
          .filter((filteredItem) => parseInt(filteredItem.totalPrice.N, 10) <= (priceAtOnce * 1.2));

        let lastFilteredReceipts = [...timeFilteredReceipts].sort(() => Math.random() - 0.5);

        if (priceFilteredReceipts.length) {
          lastFilteredReceipts = [...priceFilteredReceipts].sort(() => Math.random() - 0.5);
        }

        const lastItem = lastFilteredReceipts[0];
        let dupCount = 1;
        const idx = receiptPerDay
          .findIndex((target) => target.recipeName === lastItem.recipeName.S);
        totalMealPrice += parseInt(lastItem.totalPrice.N, 10);
        const requirements = JSON.parse(lastItem.requirements.S);
        // eslint-disable-next-line max-len
        if (idx === -1) {
          receiptPerDay.push({
            totalPrice: parseInt(lastItem.totalPrice.N, 10),
            recipeName: lastItem.recipeName.S,
            mealTime: lastItem.mealTime.S,
            step: lastItem.step.S,
            receiptId: lastItem.receiptId.S,
            time: parseInt(lastItem.time.N, 10),
            headcount: parseInt(lastItem.headcount.N, 10),
            difficulty: lastItem.difficulty.S,
            thumbnail: lastItem.thumbnail.S,
          });
        } else {
          dupCount += 1;

          receiptPerDay[idx] = {
            ...receiptPerDay[idx],
            totalPrice: parseInt(lastItem.totalPrice.N, 10) * dupCount,
            headcount: parseInt(lastItem.headcount.N, 10) * dupCount,
          };
        }
        const ingredientCount = Math
          .floor((parseInt(lastItem.headcount.N, 10) * dupCount) / parseInt(headcount, 10));

        if (requirements.length) {
          requirements.forEach((ingredient) => {
            // eslint-disable-next-line max-len
            const ingredientIdx = ingredientList.findIndex((v) => v && v.ingredientId === ingredient.ingredientId);

            if (ingredientIdx === -1) {
              ingredientList.push({
                ...ingredient,
                ingredientCount: ingredientCount < 2 ? 1 : ingredientCount,
              });
            } else {
              ingredientList[ingredientIdx] = {
                ...ingredient,
                ingredientCount: ingredientCount < 2
                  ? ingredientList[ingredientIdx].ingredientCount + 1
                  : ingredientList[ingredientIdx].ingredientCount + ingredientCount,
              };
            }
          });
        }
      });

      receiptList.push(receiptPerDay);
    }

    res.status(200).json({
      success: true,
      data: {
        receiptList: [...receiptList],
        ingredientList: [...ingredientList],
        totalMealPrice,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
