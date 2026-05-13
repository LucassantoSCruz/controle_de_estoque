const sequelize = require('sequelize');

const connection = require('../database/database');
const modelProduto = require('./modelProduto');

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
  data_registro: {
    type: sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.NOW,
  },
  observacao_movimentacao: {
    type: sequelize.STRING(150),
    allowNull: false,
  },
  freezeTableName: true,
});

modelProduto.hasMany(modelMovimentacao, {
  foreignKey: 'cod_produto',
});

modelMovimentacao.belongsTo(modelProduto, {
  foreignKey: 'cod_produto',
});

// modelMovimentacao.sync({ force: true });

module.exports = modelMovimentacao;
