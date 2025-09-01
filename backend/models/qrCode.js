const { DataTypes, INTEGER, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");
const TableUrl = require("./TableUrl")

const tblQrCode = sequelize.define("tblQrCode", {
id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
},
    urlId:{
        type:DataTypes.UUID,
        references:{
            model:TableUrl,
            key:'id'
        }
    },
    shortUrl:{
        type:DataTypes.STRING,
    },
    imageUrl:{
        type:DataTypes.STRING,
        url:null
    }

})

tblQrCode.belongsTo(TableUrl, { foreignKey: 'urlId' });

module.exports = tblQrCode