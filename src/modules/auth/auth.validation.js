const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').isIn(['RENTER', 'OWNER']).withMessage('Role harus RENTER atau OWNER'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

module.exports = {
  registerValidation,
  loginValidation,
};
