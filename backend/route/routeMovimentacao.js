const express = require('express');
const router = express.Router();
const modelMovimentacao = require('../model/modelMovimentacao');

router.post('/cadastrarMovimentacao', (req, res) => {
  console.log(req.body);

  let {
    cod_produto,
    tipo_movimentacao,
    quantidade_movimentacao,
    data_movimentacao,
    observacao_movimentacao,
  } = req.body;

  modelMovimentacao
    .create({
      cod_produto,
      tipo_movimentacao,
      quantidade_movimentacao,
      data_movimentacao,
      observacao_movimentacao,
    })
    .then(() => {
      return res.status(201).json({
        erroStatus: false,
        mensagemStatus: 'MOVIMENTAÇÃO INSERIDA COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        errorStatus: true,
        mensagemStatus: 'ERRO AO CADASTRAR A MOVIMENTAÇÃO.',
        errorObject: error,
      });
    });
});

// GET /movimentacoes → listar todas
router.get('/listarMovimentacao', (req, res) => {
  modelMovimentacao
    .findAll()
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

module.exports = router;
