const { DataTypes, INTEGER, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");

const TableOtps = sequelize.define("tblOtp",{
id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
},
    loginId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    code:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = TableOtps