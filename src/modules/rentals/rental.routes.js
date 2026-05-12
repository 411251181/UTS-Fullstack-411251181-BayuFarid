const express = require('express');
const rentalController = require('./rental.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const { idParamValidation, createRentalValidation } = require('./rental.validation');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware('RENTER'), createRentalValidation, validate, rentalController.createRental);
router.get('/my', roleMiddleware('RENTER'), rentalController.getMyRentals);
router.get('/owner', roleMiddleware('OWNER'), rentalController.getOwnerRentals);
router.get('/:id', idParamValidation, validate, rentalController.getRentalById);
router.patch('/:id/return', idParamValidation, validate, rentalController.returnRental);
router.patch('/:id/cancel', idParamValidation, validate, rentalController.cancelRental);

module.exports = router;
