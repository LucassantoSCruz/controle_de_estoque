const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const modelProduto = require('../model/modelProduto');
const modelCategoria = require('../model/modelCategoria');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/cadastrarProduto', upload.single('image'), async (req, res) => {
  const { nome_produto, preco_produto, estoque_atual, cod_categoria } =
    req.body;

  let caminho_imagem = null;

  if (req.file) {
    const filename = `${Date.now()}.png`;
    const outputPath = path.join(__dirname, '..', 'uploads', filename);

    await sharp(req.file.buffer).png().toFile(outputPath);

    caminho_imagem = filename;
  }

  modelProduto
    .create({
      nome_produto,
      preco_produto,
      estoque_atual,
      cod_categoria,
      caminho_imagem,
    })
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

router.put('/alterarProduto', upload.single('image'), async (req, res) => {
  const {
    cod_produto,
    nome_produto,
    preco_produto,
    estoque_atual,
    cod_categoria,
  } = req.body;

  // monta o objeto de atualização com os campos de texto
  const updates = {
    nome_produto,
    preco_produto,
    estoque_atual,
    cod_categoria,
  };

  // se o usuário enviou uma nova imagem, salva ela e atualiza o caminho
  if (req.file) {
    const filename = `${Date.now()}.png`;
    const outputPath = path.join(__dirname, '..', 'uploads', filename);

    await sharp(req.file.buffer).png().toFile(outputPath);

    updates.caminho_imagem = filename; // coluna no banco
  }

  modelProduto
    .update(updates, { where: { cod_produto } }) // usa o objeto `updates`
    .then(() => {
      return res.status(200).json({
        erroStatus: false,
        mensagemStatus: 'PRODUTO ALTERADO COM SUCESSO.',
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
