import Navbar from '../components/Navbar';
import axios from 'axios';
import { ENDERECO_API } from '../config';
import { useEffect, useState } from 'react';
import ModalCreateMovimentacao from '../components/ModalCreateMovimentacao';

const Movimentacoes = () => {
  const [ordenacao, setOrdenacao] = useState('movimentacao');
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarMovimentacao')
      .then((response) => {
        setMovimentacoes(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar movimentações:', error);
        setLoading(false);
      });
  }, []);

  const excluirMovimentacao = async (cod_movimentacao) => {
    await axios.delete(
      ENDERECO_API + `/deletarMovimentacao/${cod_movimentacao}`
    );
    window.location.reload();
  };

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

  const movimentacoesOrdenadas = [...movimentacoes].sort((a, b) => {
    if (ordenacao === 'registro') {
      return new Date(b.data_registro) - new Date(a.data_registro);
    }
    return new Date(b.data_movimentacao) - new Date(a.data_movimentacao);
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <Navbar />
      </div>

      <div className="container mt-4 flex-grow-1 p-4 gap-3">
        <div className="d-flex justify-content-between my-4">
          <div>
            <h1>Movimentações</h1>
          </div>

          <div className="d-flex gap-2">
            <select
              className="form-select"
              style={{ width: '220px' }}
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="movimentacao">Ordenar por: Movimentação</option>
              <option value="registro">Ordenar por: Registro</option>
            </select>

            <ModalCreateMovimentacao />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Produto</th>
                <th style={{ width: '15%' }}>Tipo</th>
                <th style={{ width: '10%' }}>Quantidade</th>
                <th style={{ width: '20%' }}>Data</th>
                <th style={{ width: '20%' }}>Observação</th>
                <th style={{ width: '15%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(movimentacoesOrdenadas) &&
              movimentacoesOrdenadas.length > 0 ? (
                movimentacoesOrdenadas.map((mov) => (
                  <tr key={mov.cod_movimentacao}>
                    <td>{mov.tbl_produto?.nome_produto ?? '—'}</td>
                    <td>{badgeTipo(mov.tipo_movimentacao)}</td>
                    <td>{mov.quantidade_movimentacao}</td>
                    <td>
                      <div>
                        <strong>{formatarData(mov.data_movimentacao)}</strong>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6c757d',
                          }}
                        >
                          Registrado em: {formatarData(mov.data_registro)}
                        </div>
                      </div>
                    </td>

                    <td>{mov.observacao_movimentacao}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          excluirMovimentacao(mov.cod_movimentacao)
                        }
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movimentacoes;
