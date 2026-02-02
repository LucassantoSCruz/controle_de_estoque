/*IMPORTA O PACOTE DO EXPRESS PARA O SCRIPT index.js*/
const express = require('express');

const modelProduto = require('../model/modelProduto');
const modelCategoria = require('../model/modelCategoria');

/*GERENCIADOR DE ROTAS DO EXPRESS*/
const router = express.Router();

/** ROTAS DE CRUD DE PRODUTO **/

//ROTA DE CADASTRO DE PRODUTOS
//NOME (P1, P2, P3, P4){}
router.post('/cadastrarProduto', (req, res) => {
  console.log(req.body);

  let { nome_produto, preco_produto, estoque_atual, cod_categoria } = req.body;

  modelProduto
    .create({ nome_produto, preco_produto, estoque_atual, cod_categoria })
    .then(() => {
      return res.status(201).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTO CADASTRADO COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        errorStatus: true,
        mensagemStatus: 'ERRO AO CADASTRAR O PRODUTO.',
        errorObject: error,
      });
    });
});

//ROTA DE LISTAGEM DE PRODUTO SEM CRITÉRIO
router.get('/listarProduto', (req, res) => {
  modelProduto
    .findAll()
    .then((response) => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTOS LISTADAS COM SUCESSO.',
        data: response,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO LISTAR OS PRODUTOS.',
        errorObject: error,
      });
    });
});

router.get('/listarProdutoComCategoria', (req, res) => {
  Promise.all([modelProduto.findAll(), modelCategoria.findAll()])
    .then(([produtos, categorias]) => {
      const produtosComCategoria = produtos.map((produto) => ({
        ...produto.dataValues,
        nome_categoria:
          categorias.find((cat) => cat.cod_categoria == produto.cod_categoria)
            ?.nome_categoria || 'N/C',
      }));

      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTOS COM CATEGORIAS LISTADOS COM SUCESSO.',
        data: produtosComCategoria,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO LISTAR PRODUTOS COM CATEGORIAS.',
        errorObject: error,
      });
    });
});

//ROTA DE ALTERAÇÃO DE PRODUTO
router.put('/alterarProduto', (req, res) => {
  const {
    cod_produto,
    nome_produto,
    preco_produto,
    estoque_atual,
    cod_categoria,
  } = req.body;

  modelProduto
    .update(
      { nome_produto, preco_produto, estoque_atual, cod_categoria },
      { where: { cod_produto } }
    )
    .then(() => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTO ALTERADA COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO ALTERAR O PRODUTO.',
        errorObject: error,
      });
    });
});

//ROTA DE EXCLUSÃO DE PRODUTO
router.delete('/excluirProduto/:cod_produto', (req, res) => {
  console.log(req.params);
  let { cod_produto } = req.params;

  modelProduto
    .destroy({ where: { cod_produto } })
    .then(() => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTO EXCLUIDO COM SUCESSO.',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        erroStatus: true,
        mensagemStatus: 'ERRO AO EXCLUIR O PRODUTO.',
        errorObject: error,
      });
    });
});

module.exports = router;
