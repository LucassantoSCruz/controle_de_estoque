import Navbar from '../components/Navbar';
import axios from 'axios';
import { ENDERECO_API } from '../config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarProdutoComCategoria')
      .then((response) => {
        const produtos = response.data.data;

        setTotalProdutos(produtos.length);
        const baixo = produtos.filter((p) => p.estoque_atual <= 5);
        setEstoqueBaixo(baixo.length);

        return axios.get(ENDERECO_API + '/listarCategoria');
      })
      .then((response) => {
        setTotalCategorias(response.data.data.length);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <Navbar />
      </div>

      <div className="container mt-4 flex-grow-1 p-4">
        <h1>Dashboard</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="d-flex gap-3 mt-4">
            <div className="card p-3 flex-fill shadow-sm">
              <h6>Total de Produtos</h6>
              <h2>{totalProdutos}</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Ver Produtos
              </button>
            </div>

            <div className="card p-3 flex-fill shadow-sm">
              <h6>Total de Categorias</h6>
              <h2>{totalCategorias}</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/categories')}
              >
                Ver Categorias
              </button>
            </div>

            <div className="card p-3 flex-fill shadow-sm">
              <h6>Estoque Baixo</h6>
              <h2>{estoqueBaixo}</h2>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => navigate('/products?estoque=baixo')}
              >
                Ver Produtos com Estoque Baixo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
