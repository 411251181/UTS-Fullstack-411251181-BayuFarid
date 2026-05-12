const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const escapeIdentifier = (value) => `\`${String(value).replace(/`/g, '``')}\``;

const formatValue = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  if (Buffer.isBuffer(value)) return `X'${value.toString('hex')}'`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';

  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
};

const exportDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL belum diatur di .env');
  }

  const url = new URL(databaseUrl);
  const databaseName = url.pathname.replace('/', '');

  if (!databaseName) {
    throw new Error('Nama database tidak ditemukan pada DATABASE_URL');
  }

  const outputDir = path.join(process.cwd(), 'database');
  const outputFile = path.join(outputDir, `${databaseName}.sql`);

  fs.mkdirSync(outputDir, { recursive: true });

  const connection = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: databaseName,
  });

  const [tables] = await connection.query('SHOW FULL TABLES WHERE Table_type = \'BASE TABLE\'');
  const tableNameKey = `Tables_in_${databaseName}`;

  const sql = [
    `-- Eco-Share database export`,
    `-- Database: ${databaseName}`,
    `-- Generated at: ${new Date().toISOString()}`,
    '',
    `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(databaseName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    `USE ${escapeIdentifier(databaseName)};`,
    '',
    'SET FOREIGN_KEY_CHECKS=0;',
    '',
  ];

  for (const row of tables) {
    const tableName = row[tableNameKey];
    const [[createTableRow]] = await connection.query(`SHOW CREATE TABLE ${escapeIdentifier(tableName)}`);
    const createTableSql = createTableRow['Create Table'];

    sql.push(`DROP TABLE IF EXISTS ${escapeIdentifier(tableName)};`);
    sql.push(`${createTableSql};`);
    sql.push('');
  }

  for (const row of tables) {
    const tableName = row[tableNameKey];
    const [records] = await connection.query(`SELECT * FROM ${escapeIdentifier(tableName)}`);

    if (records.length === 0) {
      continue;
    }

    const columns = Object.keys(records[0]).map(escapeIdentifier).join(', ');
    const values = records
      .map((record) => `(${Object.values(record).map(formatValue).join(', ')})`)
      .join(',\n');

    sql.push(`INSERT INTO ${escapeIdentifier(tableName)} (${columns}) VALUES`);
    sql.push(`${values};`);
    sql.push('');
  }

  sql.push('SET FOREIGN_KEY_CHECKS=1;');
  sql.push('');

  await connection.end();
  fs.writeFileSync(outputFile, sql.join('\n'));

  console.log(`Database berhasil diexport ke ${outputFile}`);
};

exportDatabase().catch((error) => {
  console.error('Gagal export database:', error.message);
  process.exit(1);
});
