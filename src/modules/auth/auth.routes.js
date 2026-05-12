const express = require('express');
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const validate = require('../../middlewares/validate.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
