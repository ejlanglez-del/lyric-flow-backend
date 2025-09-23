const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const { registerUser, authUser, updateUserProfile } = require('../controllers/userController'); // Import updateUserProfile

// /api/users/login
router.post('/login', authUser);

// /api/users/register
router.post('/register', registerUser);

// /api/users/profile
router.put('/profile', protect, updateUserProfile); // Add the new route

module.exports = router;
