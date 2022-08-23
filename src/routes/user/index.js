const express = require('express');

const router = express.Router();

const getUserList = require('routes/user/getUserList');

// 유저 목록 조회
router.use('/getUserList', getUserList);

module.exports = router;
