const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(new AppError('Validasi gagal', 422, errors));
  }

  return next();
};

module.exports = validate;
