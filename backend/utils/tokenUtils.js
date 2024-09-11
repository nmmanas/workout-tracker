const jwt = require('jsonwebtoken');

const refreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { refreshToken };