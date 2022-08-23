const express = require('express');

const router = express.Router();
const AWS = require('aws-sdk');

const containKeyword = require('utils/containKeyword');

// const putItem = () => {
//   const dynamodb = new AWS.DynamoDB();

//   recipes.forEach((item, idx) => {
//     if (idx !== 0) {
//       const params = {
//         Item: {
//           receiptId: {
//             S: `2022-0822-0900-000${idx + 1}`,
//           },
//           recipeName: {
//             S: item.recipeName,
//           },
//           keyword: {
//             SS: item.keyword,
//           },
//           headcount: {
//             N: `${item.headcount}`,
//           },
//           mealTime: {
//             SS: item.mealTime,
//           },
//           difficulty: {
//             S: item.difficulty,
//           },
//           time: {
//             N: `${item.time}`,
//           },
//           thumbnail: {
//             S: item.thumbnail,
//           },
//           step: {
//             S: item.step,
//           },
//           requirements: {
//             S: JSON.stringify(item.requirements),
//           },
//         },
//         ReturnConsumedCapacity: 'TOTAL',
//         TableName: 'receipt',
//       };
//       dynamodb.putItem(params, (err, data) => {
//         if (err) console.log(err, err.stack); // an error occurred
//         else console.log(data); // successful response
//       });
//     }
//   });
// };

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

    const receipts = Items.filter((v) => containKeyword(v.keyword.S, keyword));

    const receiptList = [];
    const ingredientList = [];
    for (let i = 0; i < count; i += 1) {
      const receiptPerDay = [];
      mealTime.split(',').forEach((time) => {
        const targetReceipts = receipts.filter((item) => {
          const priceCondition = parseInt(item.totalPrice.N, 10) < (priceAtOnce * 1.1);
          const timeCondition = (item.mealTime.S).split(',').includes(time);
          // eslint-disable-next-line max-len
          const isExisted = receiptPerDay.findIndex((v) => v && v.recipeName && item.recipeName.S === v.recipeName.S) !== -1;
          if (priceCondition && timeCondition && !isExisted) {
            return true;
          }
          return false;
        }).map((item) => {
          const requirements = JSON.parse(item.requirements.S);
          // eslint-disable-next-line max-len
          const ingredientCount = Math.floor(parseInt(item.headcount.N, 10) / parseInt(headcount, 10));

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

          return {
            totalPrice: parseInt(item.totalPrice.N, 10),
            recipeName: item.recipeName.S,
            mealTime: item.mealTime.S,
            step: item.step.S,
            receiptId: item.receiptId.S,
            time: parseInt(item.time.N, 10),
            headcount: parseInt(item.headcount.N, 10),
            difficulty: item.difficulty.S,
            thumbnail: item.thumbnail.S,
          };
        });

        receiptPerDay.push(...targetReceipts);
      });

      receiptList.push(receiptPerDay);
    }

    res.status(200).json({
      success: true,
      data: {
        receiptList: [...receiptList],
        ingredientList: [...ingredientList],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
