const { DataTypes, INTEGER, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");
const TableUrl = require("./TableUrl")

const tblRedirects = sequelize.define("tblRedirect", {
id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
},
    urlId: {
        type: DataTypes.UUID,
        references: {
            model: TableUrl,
            key: 'id'
        }
    },
    shortUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("normal", "meta"),
        defaultValue: "normal"
    },
    expiryAt: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

})

tblRedirects.belongsTo(TableUrl, { foreignKey: 'urlId' });
TableUrl.hasOne(tblRedirects, { foreignKey: 'urlId', as: 'UrlRedirect' });

module.exports = tblRedirects