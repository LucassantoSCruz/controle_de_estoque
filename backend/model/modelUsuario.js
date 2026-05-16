const sequelize = require('sequelize');
const connection = require('../database/database');

const modelUsuario = connection.define(
  'tbl_usuario',
  {
    cod_usuario: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = modelUsuario;
