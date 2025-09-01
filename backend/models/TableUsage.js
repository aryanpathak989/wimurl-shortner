const { DataTypes, INTEGER, Sequelize } = require("sequelize");
const sequelize = require("../lib/database");
const Users = require("./User");

const TableUsage = sequelize.define("tblUsage", {
id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: Sequelize.literal("gen_random_uuid()"), // Postgres extension pgcrypto
},
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },
  month:{
    type:INTEGER,
    allowNull:false
  },
  year:{
    type: INTEGER,
    allowNull:false
  },
  type: {
    type: DataTypes.ENUM("links", "qrcodes","customHalf"),
    allowNull: false,
  },
  limitused: {
    type: INTEGER,
    allowNull: false,
  },
});


Users.hasMany(TableUsage, {
  foreignKey: "user_id",
  as: "userUsage",
});


TableUsage.belongsTo(Users, {
  foreignKey: "user_id",
  as: "usageByUser",
});

module.exports = TableUsage;
