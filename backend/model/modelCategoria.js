const sequelize = require('sequelize');

const connection = require('../database/database');

const modelCategoria = connection.define(
  'tbl_categoria',
  {
    cod_categoria: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_categoria: {
      type: sequelize.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// modelCategoria.sync({ force: true });

module.exports = modelCategoria;
