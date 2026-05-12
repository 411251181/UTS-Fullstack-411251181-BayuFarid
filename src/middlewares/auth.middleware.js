const userRepository = require('../modules/users/user.repository');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Token tidak ditemukan', 401);
    }

    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new AppError('User tidak ditemukan', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Token tidak valid', 401));
    }

    return next(error);
  }
};

module.exports = authMiddleware;
