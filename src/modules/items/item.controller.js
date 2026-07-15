const itemService = require('./item.service');
const { successResponse } = require('../../utils/response');

const getAvailableItems = async (req, res, next) => {
  try {
    const data = await itemService.getAvailableItems();
    return successResponse(res, 'Daftar barang berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const getCatalogSummary = async (req, res, next) => {
  try {
    const data = await itemService.getCatalogSummary();
    return successResponse(res, 'Ringkasan katalog berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const data = await itemService.getItemById(req.params.id);
    return successResponse(res, 'Detail barang berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const getOwnerItems = async (req, res, next) => {
  try {
    const data = await itemService.getOwnerItems(req.user.id);
    return successResponse(res, 'Daftar barang milik owner berhasil diambil', data);
  } catch (error) {
    return next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const data = await itemService.createItem(req.user.id, req.body);
    return successResponse(res, 'Barang berhasil dibuat', data, 201);
  } catch (error) {
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const data = await itemService.updateItem(req.user.id, req.params.id, req.body);
    return successResponse(res, 'Barang berhasil diperbarui', data);
  } catch (error) {
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const data = await itemService.deleteItem(req.user.id, req.params.id);
    return successResponse(res, 'Barang berhasil dihapus', data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAvailableItems,
  getCatalogSummary,
  getItemById,
  getOwnerItems,
  createItem,
  updateItem,
  deleteItem,
};
