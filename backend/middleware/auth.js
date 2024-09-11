const jwt = require('jsonwebtoken');
const { refreshToken } = require('../utils/tokenUtils');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };

    // Check if token is about to expire (less than 1 day left)
    const tokenExp = new Date(decoded.exp * 1000);
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (tokenExp < oneDayFromNow) {
      // Token is about to expire, refresh it
      const newToken = refreshToken(decoded.userId);
      res.setHeader('X-New-Token', newToken);
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};