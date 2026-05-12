const { body, param } = require('express-validator');

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID barang tidak valid'),
];

const createItemValidation = [
  body('name').trim().notEmpty().withMessage('Nama barang wajib diisi'),
  body('description').trim().notEmpty().withMessage('Deskripsi wajib diisi'),
  body('category').trim().notEmpty().withMessage('Kategori wajib diisi'),
  body('dailyPrice').isFloat({ gt: 0 }).withMessage('Harga harian harus lebih dari 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stok tidak boleh negatif'),
  body('status').optional().isIn(['AVAILABLE', 'UNAVAILABLE', 'INACTIVE']).withMessage('Status barang tidak valid'),
];

const updateItemValidation = [
  ...idParamValidation,
  body('name').optional().trim().notEmpty().withMessage('Nama barang tidak boleh kosong'),
  body('description').optional().trim().notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  body('category').optional().trim().notEmpty().withMessage('Kategori tidak boleh kosong'),
  body('dailyPrice').optional().isFloat({ gt: 0 }).withMessage('Harga harian harus lebih dari 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stok tidak boleh negatif'),
  body('status').optional().isIn(['AVAILABLE', 'UNAVAILABLE', 'INACTIVE']).withMessage('Status barang tidak valid'),
];

module.exports = {
  idParamValidation,
  createItemValidation,
  updateItemValidation,
};
