const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/dashboard', auth, adminAuth, (req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard' });
});

module.exports = router;