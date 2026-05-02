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
  const [movimentacoes, setMovimentacoes] = useState([]);
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

        return axios.get(ENDERECO_API + '/listarMovimentacao');
      })
      .then((response) => {
        const movs = response.data.data;

        const recentes = movs
          .sort(
            (a, b) =>
              new Date(b.data_movimentacao) - new Date(a.data_movimentacao)
          )
          .slice(0, 5);

        setMovimentacoes(recentes);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const badgeTipo = (tipo) => {
    const map = {
      entrada: 'success',
      saida: 'danger',
      ajuste: 'warning',
    };

    return (
      <span className={`badge bg-${map[tipo] || 'secondary'}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </span>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container mt-4 flex-grow-1 p-4">
        <h1>Dashboard</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {/* CARDS */}
            <div className="row mt-3 g-3">
              <div className="col-md-4">
                <div className="card p-3 h-100 shadow-sm d-flex flex-column">
                  <h6>Total de Produtos</h6>
                  <h2>{totalProdutos}</h2>
                  <button
                    type="button"
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate('/products')}
                  >
                    Ver Produtos
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3 h-100 shadow-sm d-flex flex-column">
                  <h6>Total de Categorias</h6>
                  <h2>{totalCategorias}</h2>
                  <button
                    type="button"
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate('/categories')}
                  >
                    Ver Categorias
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3 h-100 shadow-sm d-flex flex-column">
                  <h6>Estoque Baixo</h6>
                  <h2>{estoqueBaixo}</h2>
                  <button
                    type="button"
                    className="btn btn-warning mt-auto"
                    onClick={() => navigate('/products?estoque=baixo')}
                  >
                    Ver Produtos com Estoque Baixo
                  </button>
                </div>
              </div>
            </div>

            {/* MOVIMENTAÇÕES RECENTES */}
            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Movimentações Recentes</h5>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate('/movimentacoes')}
                  >
                    Ver todas
                  </button>
                </div>

                {movimentacoes.length === 0 ? (
                  <p className="text-muted">Nenhuma movimentação encontrada</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Tipo</th>
                          <th>Qtd</th>
                          <th>Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimentacoes.map((mov) => (
                          <tr key={mov.cod_movimentacao}>
                            <td>{mov.tbl_produto?.nome_produto ?? '—'}</td>
                            <td>{badgeTipo(mov.tipo_movimentacao)}</td>
                            <td>{mov.quantidade_movimentacao}</td>
                            <td>{formatarData(mov.data_movimentacao)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
