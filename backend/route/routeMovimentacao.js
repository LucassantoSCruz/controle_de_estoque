const express = require('express');
const router = express.Router();
const modelMovimentacao = require('../model/modelMovimentacao');
const modelProduto = require('../model/modelProduto');
const connection = require('../database/database');

// POST /cadastrarMovimentacao → criar movimentação e atualizar estoque do produto
router.post('/cadastrarMovimentacao', (req, res) => {
  console.log(req.body);

  let {
    cod_produto,
    tipo_movimentacao,
    quantidade_movimentacao,
    data_movimentacao,
    observacao_movimentacao,
  } = req.body;

  quantidade_movimentacao = parseInt(quantidade_movimentacao);

  modelProduto
    .findByPk(cod_produto)
    .then((produto) => {
      if (!produto) {
        return res.status(404).json({
          erroStatus: true,
          mensagemStatus: 'PRODUTO NÃO ENCONTRADO.',
        });
      }

      let novoEstoque = produto.estoque_atual;

      if (tipo_movimentacao === 'entrada') {
        novoEstoque += quantidade_movimentacao;
      } else if (tipo_movimentacao === 'saida') {
        if (produto.estoque_atual < quantidade_movimentacao) {
          return res.status(400).json({
            erroStatus: true,
            mensagemStatus: 'ESTOQUE INSUFICIENTE PARA REALIZAR A SAÍDA.',
          });
        }
        novoEstoque -= quantidade_movimentacao;
      } else if (tipo_movimentacao === 'ajuste') {
        novoEstoque = quantidade_movimentacao;
      }

      return connection.transaction((t) => {
        return modelMovimentacao
          .create(
            {
              cod_produto,
              tipo_movimentacao,
              quantidade_movimentacao,
              data_movimentacao,
              observacao_movimentacao,
            },
            { transaction: t }
          )
          .then(() => {
            return modelProduto.update(
              { estoque_atual: novoEstoque },
              { where: { cod_produto }, transaction: t }
            );
          });
      });
    })
    .then(() => {
      return res.status(201).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÃO INSERIDA COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO CADASTRAR A MOVIMENTAÇÃO.',
        errorObject: error,
      });
    });
});

// GET /listarMovimentacao → listar todas com dados do produto
router.get('/listarMovimentacao', (req, res) => {
  modelMovimentacao
    .findAll({
      include: [
        {
          model: modelProduto,
          attributes: ['cod_produto', 'nome_produto', 'estoque_atual'],
        },
      ],
      order: [['data_movimentacao', 'DESC']],
    })
    .then((response) => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÕES LISTADAS COM SUCESSO.',
        data: response,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO LISTAR AS MOVIMENTAÇÕES.',
        errorObject: error,
      });
    });
});

// GET /listarMovimentacao/:cod_produto → listar movimentações de um produto específico
router.get('/listarMovimentacao/:cod_produto', (req, res) => {
  const { cod_produto } = req.params;

  modelMovimentacao
    .findAll({
      where: { cod_produto },
      include: [
        {
          model: modelProduto,
          attributes: ['cod_produto', 'nome_produto', 'estoque_atual'],
        },
      ],
      order: [['data_movimentacao', 'DESC']],
    })
    .then((response) => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÕES DO PRODUTO LISTADAS COM SUCESSO.',
        data: response,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO LISTAR AS MOVIMENTAÇÕES DO PRODUTO.',
        errorObject: error,
      });
    });
});

// PUT /editarMovimentacao/:cod_movimentacao → editar observação e data
router.put('/editarMovimentacao/:cod_movimentacao', (req, res) => {
  console.log(req.body);

  const { cod_movimentacao } = req.params;
  const { observacao_movimentacao, data_movimentacao } = req.body;

  modelMovimentacao
    .update(
      { observacao_movimentacao, data_movimentacao },
      { where: { cod_movimentacao } }
    )
    .then(() => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÃO ATUALIZADA COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO ATUALIZAR A MOVIMENTAÇÃO.',
        errorObject: error,
      });
    });
});

// DELETE /deletarMovimentacao/:cod_movimentacao → deletar movimentação
router.delete('/deletarMovimentacao/:cod_movimentacao', (req, res) => {
  const { cod_movimentacao } = req.params;

  modelMovimentacao
    .destroy({ where: { cod_movimentacao } })
    .then(() => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÃO DELETADA COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO DELETAR A MOVIMENTAÇÃO.',
        errorObject: error,
      });
    });
});

module.exports = router;
