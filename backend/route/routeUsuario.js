const express = require('express');
const jwt = require('jsonwebtoken');
const modelUsuario = require('../model/modelUsuario');

const router = express.Router(); // 👈 estava faltando isso

const SECRET = process.env.JWT_SECRET || 'segredo123';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erroStatus: true,
      mensagemStatus: 'Email e senha obrigatórios.',
    });
  }

  try {
    const usuario = await modelUsuario.findOne({ where: { email } });
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      return res
        .status(401)
        .json({ erroStatus: true, mensagemStatus: 'Usuário não encontrado.' });
    }

    const senhaValida = senha === usuario.senha;
    console.log('Senha valida:', senhaValida);

    if (!senhaValida) {
      return res
        .status(401)
        .json({ erroStatus: true, mensagemStatus: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      {
        cod_usuario: usuario.cod_usuario,
        nome: usuario.nome,
        email: usuario.email,
      },
      SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      erroStatus: false,
      mensagemStatus: 'LOGIN REALIZADO COM SUCESSO.',
      token,
      nome: usuario.nome,
    });
  } catch (error) {
    console.log('ERRO NO LOGIN:', error);
    return res.status(500).json({
      erroStatus: true,
      mensagemStatus: 'Erro no servidor.',
      errorObject: error,
    });
  }
});

module.exports = router;
