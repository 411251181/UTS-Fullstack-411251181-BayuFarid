const prisma = require('../../config/database');

const defaultInclude = {
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

const findAllAvailable = () => prisma.item.findMany({
  where: {
    status: 'AVAILABLE',
    stock: {
      gt: 0,
    },
  },
  include: defaultInclude,
  orderBy: {
    createdAt: 'desc',
  },
});

const getCatalogSummary = async () => {
  const [availableItems, activeOwners, activeUsers] = await Promise.all([
    prisma.item.count({
      where: {
        status: 'AVAILABLE',
        stock: {
          gt: 0,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: 'OWNER',
      },
    }),
    prisma.user.count(),
  ]);

  return {
    availableItems,
    activeOwners,
    activeUsers,
  };
};

const findById = (id) => prisma.item.findUnique({
  where: { id: Number(id) },
  include: defaultInclude,
});

const findByOwner = (ownerId) => prisma.item.findMany({
  where: { ownerId: Number(ownerId) },
  orderBy: {
    createdAt: 'desc',
  },
});

const create = (data) => prisma.item.create({
  data,
  include: defaultInclude,
});

const update = (id, data) => prisma.item.update({
  where: { id: Number(id) },
  data,
  include: defaultInclude,
});

const remove = (id) => prisma.item.delete({
  where: { id: Number(id) },
});

const countActiveRentalsByItem = (itemId) => prisma.rental.count({
  where: {
    itemId: Number(itemId),
    status: {
      in: ['PENDING', 'ACTIVE'],
    },
  },
});

module.exports = {
  findAllAvailable,
  getCatalogSummary,
  findById,
  findByOwner,
  create,
  update,
  remove,
  countActiveRentalsByItem,
};
