import { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDERECO_API } from '../config';

const ModalCreateMovimentacao = () => {
  const [produtos, setProdutos] = useState([]);
  const [cod_produto, setCodProduto] = useState('');
  const [tipo_movimentacao, setTipoMovimentacao] = useState('');
  const [quantidade_movimentacao, setQuantidadeMovimentacao] = useState('');
  const [data_movimentacao, setDataMovimentacao] = useState('');
  const [observacao_movimentacao, setObservacaoMovimentacao] = useState('');

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarProdutoComCategoria')
      .then((response) => {
        setProdutos(response.data.data);
      })
      .catch((error) => {
        console.log('Erro ao buscar produtos:', error);
      });
  }, []);

  const cadastrarMovimentacao = () => {
    axios
      .post(ENDERECO_API + '/cadastrarMovimentacao', {
        cod_produto,
        tipo_movimentacao,
        quantidade_movimentacao,
        data_movimentacao,
        observacao_movimentacao,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log('Erro ao cadastrar movimentação:', error);
      });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalCreateMovimentacao"
      >
        Nova Movimentação
      </button>

      <div
        className="modal fade"
        id="modalCreateMovimentacao"
        tabIndex="-1"
        aria-labelledby="modalCreateMovimentacaoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCreateMovimentacaoLabel">
                Nova Movimentação
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              ></button>
            </div>

            <div className="modal-body d-flex flex-column gap-3">
              <div>
                <label className="form-label">Produto</label>
                <select
                  className="form-select"
                  value={cod_produto}
                  onChange={(e) => setCodProduto(e.target.value)}
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option
                      key={produto.cod_produto}
                      value={produto.cod_produto}
                    >
                      {produto.nome_produto} (estoque: {produto.estoque_atual})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Tipo de Movimentação</label>
                <select
                  className="form-select"
                  value={tipo_movimentacao}
                  onChange={(e) => setTipoMovimentacao(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>

              <div>
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={quantidade_movimentacao}
                  onChange={(e) => setQuantidadeMovimentacao(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Data</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={data_movimentacao}
                  onChange={(e) => setDataMovimentacao(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Observação</label>
                <textarea
                  className="form-control"
                  rows="3"
                  maxLength={150}
                  value={observacao_movimentacao}
                  onChange={(e) => setObservacaoMovimentacao(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={cadastrarMovimentacao}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCreateMovimentacao;
