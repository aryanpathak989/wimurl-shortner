const { DataTypes, INTEGER, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");
const TableUrl = require("./TableUrl");

const Tracking = sequelize.define("tbltracking", {
id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
},
    urlId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TableUrl,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    ip: DataTypes.STRING,
    browser: DataTypes.STRING,
    os: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    reference: DataTypes.STRING,
    deviceVendor: DataTypes.STRING,
    city: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    date:{type:DataTypes.DATEONLY,allowNull:false},
    utm_source:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    utm_medium:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    utm_campaign:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    utm_term:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    utm_content:
    {
        type:DataTypes.STRING,
        defaultValue:null
    }
}, {
    timestamps: true
});


// Correct: urlId in Tracking references id in TableUrl
TableUrl.hasMany(Tracking, {
    foreignKey: 'urlId'
});

Tracking.belongsTo(TableUrl, {
    foreignKey: 'urlId'
});

module.exports = Tracking;
