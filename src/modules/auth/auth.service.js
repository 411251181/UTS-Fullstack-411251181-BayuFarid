const userRepository = require('../users/user.repository');
const AppError = require('../../utils/AppError');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');

const register = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError('Email sudah terdaftar', 409);
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Email atau password salah', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email atau password salah', 401);
  }

  const safeUser = userRepository.sanitizeUser(user);
  const token = generateToken({ id: user.id, role: user.role });

  return { user: safeUser, token };
};

const me = async (userId) => userRepository.findById(userId);

module.exports = {
  register,
  login,
  me,
};
