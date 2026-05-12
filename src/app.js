const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const itemRoutes = require('./modules/items/item.routes');
const rentalRoutes = require('./modules/rentals/rental.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const AppError = require('./utils/AppError');
const { successResponse } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => successResponse(res, 'Eco-Share API berjalan', {
  service: 'Eco-Share API',
  version: '1.0.0',
}));

app.get('/api/v1/health', (req, res) => successResponse(res, 'Service sehat', {
  status: 'ok',
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/rentals', rentalRoutes);

app.use((req, res, next) => next(new AppError('Endpoint tidak ditemukan', 404)));
app.use(errorMiddleware);

module.exports = app;
