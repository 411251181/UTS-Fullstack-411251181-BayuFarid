const prisma = require('../../config/database');

const rentalInclude = {
  renter: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  item: {
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  },
  histories: {
    orderBy: {
      createdAt: 'desc',
    },
  },
};

const findById = (id) => prisma.rental.findUnique({
  where: { id: Number(id) },
  include: rentalInclude,
});

const findByRenter = (renterId) => prisma.rental.findMany({
  where: { renterId: Number(renterId) },
  include: rentalInclude,
  orderBy: { createdAt: 'desc' },
});

const findByOwner = (ownerId) => prisma.rental.findMany({
  where: {
    item: {
      ownerId: Number(ownerId),
    },
  },
  include: rentalInclude,
  orderBy: { createdAt: 'desc' },
});

const createHistory = (tx, data) => tx.rentalHistory.create({ data });

module.exports = {
  rentalInclude,
  findById,
  findByRenter,
  findByOwner,
  createHistory,
};
