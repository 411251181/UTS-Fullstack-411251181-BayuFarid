const prisma = require('../../config/database');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });

const findById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  return sanitizeUser(user);
};

const create = async (data) => {
  const user = await prisma.user.create({ data });
  return sanitizeUser(user);
};

module.exports = {
  sanitizeUser,
  findByEmail,
  findById,
  create,
};
