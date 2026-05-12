const authService = require('./auth.service');
const { successResponse } = require('../../utils/response');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    return successResponse(res, 'Registrasi berhasil', data, 201);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return successResponse(res, 'Login berhasil', data);
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const data = await authService.me(req.user.id);
    return successResponse(res, 'Data user berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  me,
};
