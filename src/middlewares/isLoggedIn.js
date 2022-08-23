const verifyToken = require('utils/verifyToken');

const isLoggedIn = (req, res, next) => {
  const accessToken = req.headers['access-token'];
  if (!accessToken) {
    return res.status(403).json({ success: false, error: 'PERMISSON_DENIED' });
  }

  const decoded = verifyToken(accessToken);
  if (!decoded || !decoded.userId) {
    return res.status(403).json({ success: false, error: 'PERMISSON_DENIED' });
  }

  return next();
};

module.exports = isLoggedIn;
