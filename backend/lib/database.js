const { Sequelize } = require('sequelize');

const db = new Sequelize({
  database: process.env.Database_name, // Use 'postgres' unless you created a database named 'shrl'
  username: process.env.Database_userName,
  password: process.env.DATABASE_password, // Replace with the password set in Azure Portal
  host: process.env.DATABASE_hostname,
  port: process.env.DATABASE_port,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Azure requires SSL
      rejectUnauthorized: false
    }
  }
});

module.exports = db;
