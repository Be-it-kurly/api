const express = require('express');

const router = express.Router();
const admin = require('firebase-admin');

router.post('/', async (req, res) => {
  const {
    fcmToken, title, body, data,
  } = req.body;

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
      },
      token: fcmToken,
    };

    await admin.messaging().send(message);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
