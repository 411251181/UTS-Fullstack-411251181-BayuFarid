const rentalService = require('./rental.service');
const { successResponse } = require('../../utils/response');

const createRental = async (req, res, next) => {
  try {
    const data = await rentalService.createRental(req.user.id, req.body);
    return successResponse(res, 'Rental berhasil dibuat', data, 201);
  } catch (error) {
    return next(error);
  }
};

const getMyRentals = async (req, res, next) => {
  try {
    const data = await rentalService.getMyRentals(req.user.id);
    return successResponse(res, 'Riwayat rental berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const getOwnerRentals = async (req, res, next) => {
  try {
    const data = await rentalService.getOwnerRentals(req.user.id);
    return successResponse(res, 'Daftar transaksi owner berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const getRentalById = async (req, res, next) => {
  try {
    const data = await rentalService.getRentalById(req.user, req.params.id);
    return successResponse(res, 'Detail rental berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const returnRental = async (req, res, next) => {
  try {
    const data = await rentalService.returnRental(req.user, req.params.id);
    return successResponse(res, 'Rental berhasil dikembalikan', data);
  } catch (error) {
    return next(error);
  }
};

const cancelRental = async (req, res, next) => {
  try {
    const data = await rentalService.cancelRental(req.user, req.params.id);
    return successResponse(res, 'Rental berhasil dibatalkan', data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRental,
  getMyRentals,
  getOwnerRentals,
  getRentalById,
  returnRental,
  cancelRental,
};
