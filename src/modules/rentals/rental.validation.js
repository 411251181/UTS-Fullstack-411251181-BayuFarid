const { body, param } = require('express-validator');

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID rental tidak valid'),
];

const createRentalValidation = [
  body('itemId').isInt({ min: 1 }).withMessage('ID barang tidak valid'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity harus lebih dari 0'),
  body('startDate').isISO8601().withMessage('Tanggal mulai tidak valid'),
  body('endDate').isISO8601().withMessage('Tanggal selesai tidak valid'),
];

module.exports = {
  idParamValidation,
  createRentalValidation,
};
