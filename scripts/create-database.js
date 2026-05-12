const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const createDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL belum diatur di .env');
  }

  const url = new URL(databaseUrl);
  const databaseName = url.pathname.replace('/', '');

  if (!databaseName) {
    throw new Error('Nama database tidak ditemukan pada DATABASE_URL');
  }

  const connection = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    multipleStatements: false,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.end();

  console.log(`Database '${databaseName}' siap digunakan.`);
};

createDatabase().catch((error) => {
  console.error('Gagal membuat database:', error.message);
  process.exit(1);
});
