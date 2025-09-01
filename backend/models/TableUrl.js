const { DataTypes, INTEGER, UUIDV4, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");
const Users = require("./User");

const Url = sequelize.define("tblurl", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: Users,
            key: 'id'
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shortUrl: {
        type: DataTypes.STRING,
        unique: true
    },
    actualUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATEONLY
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
})

module.exports = Url