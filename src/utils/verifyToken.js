const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('configs/vars');

const verifyToken = (token) => {
  try {
    if (!token) return '';
    return jsonwebtoken.verify(token, JWT_SECRET);
  } catch (err) {
    return '';
  }
};

module.exports = verifyToken;
