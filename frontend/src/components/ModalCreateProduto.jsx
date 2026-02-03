import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { ENDERECO_API } from '../config';

const ModalCreateProduto = () => {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [novoProduto, setNovoProduto] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novoEstoque, setNovoEstoque] = useState('');
  const [novoCodCategoria, setNovoCodCategoria] = useState('');
  const [image, setImage] = useState(null);

  const [listagemCategoria, setListagemCategoria] = useState([]);

  useEffect(() => {
    setModal(new Modal(modalRef.current));
    return () => modal?.dispose();
  }, []);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarCategoria')
      .then((response) => {
        setListagemCategoria(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  const openModal = () => modal?.show();
  const closeModal = () => modal?.hide();

  function handleChangeProduto(e) {
    setNovoProduto(e.target.value);
  }
  function handleChangePreco(e) {
    setNovoPreco(e.target.value);
  }
  function handleChangeEstoque(e) {
    setNovoEstoque(e.target.value);
  }
  function handleChangeCodCategoria(e) {
    setNovoCodCategoria(e.target.value);
  }
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  function handleSubmit(e) {
    const formData = new FormData();
    formData.append('nome_produto', novoProduto);
    formData.append('preco_produto', novoPreco);
    formData.append('estoque_atual', novoEstoque);
    formData.append('cod_categoria', novoCodCategoria);
    if (image) {
      formData.append('image', image);
    }

    axios
      .post(ENDERECO_API + '/cadastrarProduto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        console.log(response);
        setNovoProduto('');
        setNovoPreco('');
        setNovoEstoque('');
        setNovoCodCategoria('');
        setImage(null);
        closeModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openModal}>
        Cadastrar Produto
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <form onSubmit={handleSubmit}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Cadastrar Produto
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Imagem do produto</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />

                <label class="form-label">Nome</label>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Digite o nome"
                  value={novoProduto}
                  onChange={handleChangeProduto}
                />

                <div class="row align-items-start">
                  <div class="col">
                    <label class="form-label mt-2">Preço</label>
                    <input
                      class="form-control"
                      type="number"
                      placeholder="0,00"
                      value={novoPreco}
                      onChange={handleChangePreco}
                    />
                  </div>
                  <div class="col">
                    <label class="form-label mt-2">Quantidade</label>
                    <input
                      class="form-control"
                      type="number"
                      placeholder="0"
                      value={novoEstoque}
                      onChange={handleChangeEstoque}
                    />
                  </div>
                </div>

                <label class="form-label mt-2">Categoria</label>
                {Array.isArray(listagemCategoria) &&
                listagemCategoria.length > 0 ? (
                  <select
                    className="form-select"
                    value={novoCodCategoria}
                    onChange={handleChangeCodCategoria}
                    aria-label="Selecione a categoria"
                  >
                    <option value="">Selecione uma categoria</option>
                    {listagemCategoria.map((categoria) => (
                      <option
                        key={categoria.cod_categoria}
                        value={categoria.cod_categoria}
                      >
                        {categoria.nome_categoria}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className="form-select"
                    aria-label="Disabled select example"
                    disabled
                  >
                    <option>Nenhuma categoria cadastrada</option>
                  </select>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalCreateProduto;
