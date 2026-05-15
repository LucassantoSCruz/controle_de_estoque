import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDERECO_API } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErro('Preencha email e senha.');
      return;
    }

    try {
      const response = await axios.post(ENDERECO_API + '/login', {
        email,
        senha,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nome', response.data.nome);
      navigate('/');
    } catch (error) {
      setErro('Email ou senha incorretos.');
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4">Controle de Estoque</h3>

          {erro && <div className="alert alert-danger py-2">{erro}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
