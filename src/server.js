const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/database');

const server = app.listen(env.port, () => {
  console.log(`Eco-Share API running on port ${env.port}`);
});

const shutdown = async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
