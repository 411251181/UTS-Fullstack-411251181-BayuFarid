const express = require('express');
const itemController = require('./item.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  idParamValidation,
  createItemValidation,
  updateItemValidation,
} = require('./item.validation');

const router = express.Router();

router.get('/', itemController.getAvailableItems);
router.get('/owner/my', authMiddleware, roleMiddleware('OWNER'), itemController.getOwnerItems);
router.get('/:id', idParamValidation, validate, itemController.getItemById);
router.post('/', authMiddleware, roleMiddleware('OWNER'), createItemValidation, validate, itemController.createItem);
router.put('/:id', authMiddleware, roleMiddleware('OWNER'), updateItemValidation, validate, itemController.updateItem);
router.delete('/:id', authMiddleware, roleMiddleware('OWNER'), idParamValidation, validate, itemController.deleteItem);

module.exports = router;
