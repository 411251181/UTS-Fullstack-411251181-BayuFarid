const itemRepository = require('./item.repository');
const AppError = require('../../utils/AppError');

const getAvailableItems = async () => itemRepository.findAllAvailable();

const getItemById = async (id) => {
  const item = await itemRepository.findById(id);

  if (!item) {
    throw new AppError('Barang tidak ditemukan', 404);
  }

  return item;
};

const getOwnerItems = async (ownerId) => itemRepository.findByOwner(ownerId);

const createItem = async (ownerId, payload) => {
  return itemRepository.create({
    ownerId: Number(ownerId),
    name: payload.name,
    description: payload.description,
    category: payload.category,
    dailyPrice: payload.dailyPrice,
    stock: payload.stock,
    status: payload.status || 'AVAILABLE',
  });
};

const updateItem = async (ownerId, itemId, payload) => {
  const item = await getItemById(itemId);

  if (item.ownerId !== Number(ownerId)) {
    throw new AppError('Anda tidak berhak mengubah barang ini', 403);
  }

  return itemRepository.update(itemId, payload);
};

const deleteItem = async (ownerId, itemId) => {
  const item = await getItemById(itemId);

  if (item.ownerId !== Number(ownerId)) {
    throw new AppError('Anda tidak berhak menghapus barang ini', 403);
  }

  const activeRentals = await itemRepository.countActiveRentalsByItem(itemId);

  if (activeRentals > 0) {
    throw new AppError('Barang tidak dapat dihapus karena sedang dipinjam', 409);
  }

  await itemRepository.remove(itemId);
  return { id: Number(itemId) };
};

module.exports = {
  getAvailableItems,
  getItemById,
  getOwnerItems,
  createItem,
  updateItem,
  deleteItem,
};
