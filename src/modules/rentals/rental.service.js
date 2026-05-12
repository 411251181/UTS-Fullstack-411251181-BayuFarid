const prisma = require('../../config/database');
const rentalRepository = require('./rental.repository');
const AppError = require('../../utils/AppError');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / MS_PER_DAY);

  if (Number.isNaN(diff) || diff <= 0) {
    throw new AppError('Tanggal selesai harus setelah tanggal mulai', 400);
  }

  return diff;
};

const createRental = async (renterId, payload) => {
  const quantity = Number(payload.quantity);
  const days = calculateRentalDays(payload.startDate, payload.endDate);

  return prisma.$transaction(async (tx) => {
    const itemRows = await tx.$queryRaw`
      SELECT * FROM items WHERE id = ${Number(payload.itemId)} FOR UPDATE
    `;
    const item = itemRows[0];

    if (!item) {
      throw new AppError('Barang tidak ditemukan', 404);
    }

    if (item.status !== 'AVAILABLE') {
      throw new AppError('Barang tidak tersedia', 400);
    }

    if (item.stock < quantity) {
      throw new AppError('Stok barang tidak mencukupi', 409);
    }

    const dailyPrice = Number(item.daily_price);
    const totalPrice = days * dailyPrice * quantity;

    await tx.item.update({
      where: { id: Number(payload.itemId) },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    const rental = await tx.rental.create({
      data: {
        renterId: Number(renterId),
        itemId: Number(payload.itemId),
        quantity,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        totalPrice,
        status: 'ACTIVE',
      },
    });

    await rentalRepository.createHistory(tx, {
      rentalId: rental.id,
      action: 'CREATED',
      note: 'Rental dibuat dan stok barang dikurangi',
    });

    return tx.rental.findUnique({
      where: { id: rental.id },
      include: rentalRepository.rentalInclude,
    });
  });
};

const getMyRentals = async (renterId) => rentalRepository.findByRenter(renterId);

const getOwnerRentals = async (ownerId) => rentalRepository.findByOwner(ownerId);

const getRentalById = async (user, rentalId) => {
  const rental = await rentalRepository.findById(rentalId);

  if (!rental) {
    throw new AppError('Rental tidak ditemukan', 404);
  }

  const isRenter = user.role === 'RENTER' && rental.renterId === Number(user.id);
  const isOwner = user.role === 'OWNER' && rental.item.ownerId === Number(user.id);

  if (!isRenter && !isOwner) {
    throw new AppError('Anda tidak berhak melihat rental ini', 403);
  }

  return rental;
};

const returnRental = async (user, rentalId) => {
  const rental = await getRentalById(user, rentalId);

  if (user.role !== 'RENTER' || rental.renterId !== Number(user.id)) {
    throw new AppError('Hanya penyewa terkait yang dapat mengembalikan barang', 403);
  }

  if (rental.status !== 'ACTIVE') {
    throw new AppError('Rental tidak dapat dikembalikan', 400);
  }

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({
      where: { id: Number(rentalId) },
      data: { status: 'RETURNED' },
    });

    await tx.item.update({
      where: { id: rental.itemId },
      data: {
        stock: {
          increment: rental.quantity,
        },
      },
    });

    await rentalRepository.createHistory(tx, {
      rentalId: Number(rentalId),
      action: 'RETURNED',
      note: 'Barang dikembalikan dan stok ditambahkan kembali',
    });

    return tx.rental.findUnique({
      where: { id: Number(rentalId) },
      include: rentalRepository.rentalInclude,
    });
  });
};

const cancelRental = async (user, rentalId) => {
  const rental = await getRentalById(user, rentalId);

  if (user.role !== 'RENTER' || rental.renterId !== Number(user.id)) {
    throw new AppError('Hanya penyewa terkait yang dapat membatalkan rental', 403);
  }

  if (!['PENDING', 'ACTIVE'].includes(rental.status)) {
    throw new AppError('Rental tidak dapat dibatalkan', 400);
  }

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({
      where: { id: Number(rentalId) },
      data: { status: 'CANCELLED' },
    });

    await tx.item.update({
      where: { id: rental.itemId },
      data: {
        stock: {
          increment: rental.quantity,
        },
      },
    });

    await rentalRepository.createHistory(tx, {
      rentalId: Number(rentalId),
      action: 'CANCELLED',
      note: 'Rental dibatalkan dan stok ditambahkan kembali',
    });

    return tx.rental.findUnique({
      where: { id: Number(rentalId) },
      include: rentalRepository.rentalInclude,
    });
  });
};

module.exports = {
  createRental,
  getMyRentals,
  getOwnerRentals,
  getRentalById,
  returnRental,
  cancelRental,
};
