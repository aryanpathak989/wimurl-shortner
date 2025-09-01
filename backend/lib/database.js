const { Sequelize } = require('sequelize');

const db = new Sequelize({
  database: 'shrl',
  username: 'postgres',
  password: 'Coli@12345',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

module.exports = db;
