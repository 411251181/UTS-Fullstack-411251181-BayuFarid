const { Prisma } = require('@prisma/client');
const env = require('../config/env');
const { errorResponse } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Data sudah digunakan';
      errors = err.meta?.target || [];
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Data tidak ditemukan';
    } else {
      statusCode = 500;
      message = 'Database error';
    }
  }

  if (env.nodeEnv !== 'production') {
    console.error(err);
  }

  return errorResponse(res, message, errors, statusCode);
};

module.exports = errorMiddleware;
