const bcrypt = require('bcrypt');
const env = require('../config/env');

const hashPassword = (password) => bcrypt.hash(password, env.bcryptSaltRounds);

const comparePassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
