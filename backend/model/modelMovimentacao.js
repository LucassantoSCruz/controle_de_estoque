const sequelize = require('sequelize');

const connection = require('../database/database');

const modelMovimentacao = connection.define('tbl_movimentacao', {
  cod_movimentacao: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cod_produto: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  tipo_movimentacao: {
    type: sequelize.ENUM('entrada', 'saida', 'ajuste'),
    allowNull: false,
  },
  quantidade_movimentacao: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  data_movimentacao: {
    type: sequelize.DATE,
    allowNull: false,
  },
  observacao_movimentacao: {
    type: sequelize.STRING(150),
    allowNull: false,
  },
});

// modelMovimentacao.sync({ force: true });

module.exports = modelMovimentacao;
