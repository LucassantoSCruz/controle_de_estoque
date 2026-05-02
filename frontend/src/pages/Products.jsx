import Navbar from '../components/Navbar';
import axios from 'axios';
import { ENDERECO_API } from '../config';
import { useEffect, useState } from 'react';
import ModalCreateProduto from '../components/ModalCreateProduto';
import ProductFilters from '../components/ProductFilters';
import ProductFilterBadges from '../components/ProductFilterBadges';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalEditProduto from '../components/ModalEditProduto';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const filtroEstoque = queryParams.get('estoque');
  const filtroCategoria = queryParams.get('categoria');
  const filtroNome = queryParams.get('nome');

  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(filtroNome || '');

  const buscarProdutos = () => {
    setLoading(true);
    axios
      .get(ENDERECO_API + '/listarProdutoComCategoria')
      .then((response) => {
        let produtos = response.data.data;

        if (filtroEstoque === 'baixo') {
          produtos = produtos.filter((p) => p.estoque_atual <= 5);
        }
        if (filtroCategoria) {
          produtos = produtos.filter(
            (p) => String(p.cod_categoria) === String(filtroCategoria)
          );
        }
        if (filtroNome) {
          produtos = produtos.filter((p) =>
            p.nome_produto.toLowerCase().includes(filtroNome.toLowerCase())
          );
        }

        setProducts(produtos);
      })
      .catch((error) => console.log('Erro ao buscar produtos:', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    buscarProdutos();

    axios
      .get(ENDERECO_API + '/listarCategoria')
      .then((response) => setCategorias(response.data.data))
      .catch((error) => console.log('Erro ao buscar categorias:', error));
  }, [filtroEstoque, filtroCategoria, filtroNome]);

  const excluirProduto = async (cod_produto) => {
    await axios.delete(ENDERECO_API + `/excluirProduto/${cod_produto}`);
    buscarProdutos(); // 👈 sem reload
  };

  const aplicarFiltro = (categoria, estoque, nome) => {
    let params = [];
    if (categoria) params.push(`categoria=${categoria}`);
    if (estoque) params.push(`estoque=${estoque}`);
    if (nome) params.push(`nome=${nome}`);
    const query = params.length ? `?${params.join('&')}` : '';
    navigate(`/products${query}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container mt-4 flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center my-4">
          <h1>Produtos</h1>
          <ModalCreateProduto onProdutoCadastrado={buscarProdutos} />
        </div>

        <ProductFilterBadges
          filtroEstoque={filtroEstoque}
          filtroCategoria={filtroCategoria}
          filtroNome={filtroNome}
          categorias={categorias}
        />

        <ProductFilters
          busca={busca}
          setBusca={setBusca}
          categorias={categorias}
          filtroCategoria={filtroCategoria}
          filtroEstoque={filtroEstoque}
          filtroNome={filtroNome}
          aplicarFiltro={aplicarFiltro}
          limparFiltro={() => navigate('/products')}
        />

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Carregando...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.cod_produto}>
                    <td>
                      <img
                        src={`${ENDERECO_API}/uploads/${product.caminho_imagem}`}
                        className="img-thumbnail"
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                        alt={product.nome_produto}
                      />
                    </td>
                    <td>{product.nome_produto}</td>
                    <td>{product.nome_categoria}</td>
                    <td>{product.estoque_atual}</td>
                    <td>{product.preco_produto}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <ModalEditProduto
                          id={product.cod_produto}
                          nome={product.nome_produto}
                          preco={product.preco_produto}
                          estoque={product.estoque_atual}
                          categoria={product.cod_categoria}
                          image={product.caminho_imagem}
                          onProdutoEditado={buscarProdutos}
                        />
                        <button
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
                  <td colSpan={6} className="text-center">
                    Nenhum produto encontrado.
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
