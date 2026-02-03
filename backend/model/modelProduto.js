const sequelize = require('sequelize');

const connection = require('../database/database');
const modelCategoria = require('./modelCategoria');

const modelProduto = connection.define('tbl_produto', {
  cod_produto: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_produto: {
    type: sequelize.STRING(50),
    allowNull: false,
  },
  preco_produto: {
    type: sequelize.DECIMAL(3, 2),
    allowNull: false,
  },
  estoque_atual: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  cod_categoria: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  caminho_imagem: {
    type: sequelize.STRING,
    allowNull: true,
  },
});

modelCategoria.hasMany(modelProduto, {
  foreignKey: 'cod_categoria',
});

modelProduto.belongsTo(modelCategoria, {
  foreignKey: 'cod_categoria',
});

// modelProduto.sync({ force: true });

module.exports = modelProduto;
