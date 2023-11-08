const { Client } = require('pg');

// Thông tin kết nối đến cơ sở dữ liệu PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'PGT',
  password: '22062001',
  port: 5432,
});

// Kết nối vào cơ sở dữ liệu

client.connect();

module.exports = client;