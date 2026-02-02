import Navbar from '../components/Navbar';
import axios from 'axios';
import { ENDERECO_API } from '../config';
import { useEffect, useState } from 'react';
import ModalCreateCategoria from '../components/ModalCreateCategoria';
import ModalEditCategoria from '../components/ModalEditCategoria';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarCategoria')
      .then((response) => {
        setCategorias(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  const excluirCategoria = async (cod_categoria) => {
    await axios.delete(ENDERECO_API + `/excluirCategoria/${cod_categoria}`);
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
            <h1>Categorias</h1>
          </div>

          <div>
            <ModalCreateCategoria />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: '80%' }}>Nome da Categoria</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(categorias) && categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.cod_categoria}>
                    <td>{categoria.nome_categoria}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <ModalEditCategoria
                          id={categoria.cod_categoria}
                          nome={categoria.nome_categoria}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            excluirCategoria(categoria.cod_categoria)
                          }
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center">
                    Nenhuma categoria encontrada.
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

export default Categorias;
