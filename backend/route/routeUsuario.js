router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

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

    const token = jwt.sign(
      {
        cod_usuario: usuario.cod_usuario,
        nome: usuario.nome,
        email: usuario.email,
      },
      SECRET,
      { expiresIn: '8h' }
    );
    console.log('Token gerado:', token);

    return res.status(200).json({
      erroStatus: false,
      mensagemStatus: 'LOGIN REALIZADO COM SUCESSO.',
      token,
      nome: usuario.nome,
    });
  } catch (error) {
    console.log('ERRO NO LOGIN:', error); // 👈 esse é o mais importante
    return res.status(500).json({
      erroStatus: true,
      mensagemStatus: 'Erro no servidor.',
      errorObject: error,
    });
  }
});
