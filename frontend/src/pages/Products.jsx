import Navbar from '../components/Navbar';
import axios from 'axios';
import { ENDERECO_API } from '../config';
import { useEffect, useState } from 'react';
import ModalCreateProduto from '../components/ModalCreateProduto';
import ModalEditProduto from '../components/ModalEditProduto';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarProdutoComCategoria')
      .then((response) => {
        setProducts(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  const excluirProduto = async (cod_produto) => {
    await axios.delete(ENDERECO_API + `/excluirProduto/${cod_produto}`);
    window.location.reload();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <Navbar />
      </div>

      <div className="container mt-4 flex-grow-1 p-4 gap-3">
        <div className="d-flex justify-content-between my-4">
          <div>
            <h1>Produtos</h1>
          </div>

          <div>
            <ModalCreateProduto />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Nome do Produto</th>
                <th style={{ width: '20%' }}>Categoria</th>
                <th style={{ width: '15%' }}>Quantidade</th>
                <th style={{ width: '15%' }}>Preço</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.cod_produto}>
                    <td>{product.nome_produto}</td>
                    <td>{product.nome_categoria}</td>
                    <td>{product.estoque_atual}</td>
                    <td>{product.preco_produto}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <ModalEditProduto
                          id={product.cod_produto}
                          nome={product.nome_produto}
                          preco={product.preco_produto}
                          estoque={product.estoque_atual}
                          categoria={product.cod_categoria}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => excluirProduto(product.cod_produto)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    Nenhuma produto encontrada.
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

export default Products;
