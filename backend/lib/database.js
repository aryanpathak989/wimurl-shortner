const { Sequelize } = require('sequelize');

const dialectOptions = process.env.NODE_ENV == "production"?{
    ssl: {
      require: true, // Azure requires SSL
      rejectUnauthorized: false
    }
  }:{}

const db = new Sequelize({
  database: process.env.Database_name, // Use 'postgres' unless you created a database named 'shrl'
  username: process.env.Database_userName,
  password: process.env.DATABASE_password,
  host: process.env.DATABASE_hostname,
  port: process.env.DATABASE_port,
  dialect: 'postgres',
  dialectOptions
});

module.exports = db;
