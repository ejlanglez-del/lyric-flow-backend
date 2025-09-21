const express = require('express');
const router = express.Router();

const { registerUser, authUser } = require('../controllers/userController');

// /api/users/login
router.post('/login', authUser);

// /api/users/register
router.post('/register', registerUser);

module.exports = router;
