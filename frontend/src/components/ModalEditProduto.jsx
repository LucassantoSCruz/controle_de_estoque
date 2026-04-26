import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { ENDERECO_API } from '../config';

const ModalEditProduto = (props) => {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [novoProduto, setNovoProduto] = useState(props.nome);
  const [novoPreco, setNovoPreco] = useState(props.preco);
  const [novoEstoque, setNovoEstoque] = useState(props.estoque);
  const [novoCodCategoria, setNovoCodCategoria] = useState(props.categoria);
  const [image, setImage] = useState(props.image);
  const [imagePreview, setImagePreview] = useState(
    props.image ? `${ENDERECO_API}/uploads/${props.image}` : null // 👈 começa com a imagem atual
  );

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
      })
      .catch((error) => {
        console.log('Erro ao buscar dados:', error);
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
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file)); // 👈 troca pelo preview do novo arquivo
    } else {
      setImagePreview(
        props.image ? `${ENDERECO_API}/uploads/${props.image}` : null
      ); // 👈 volta pra imagem original
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cod_produto', props.id);
    formData.append('nome_produto', novoProduto);
    formData.append('preco_produto', novoPreco);
    formData.append('estoque_atual', novoEstoque);
    formData.append('cod_categoria', novoCodCategoria);

    if (image instanceof File) {
      formData.append('image', image);
    }

    axios
      .put(ENDERECO_API + '/alterarProduto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response);
        closeModal();
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={openModal}>
        Editar
      </button>

      <div
        className="modal fade"
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
                  Editar Produto
                </h1>
                <button
                  type="button"
                  className="btn-close"
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
                  name="image"
                />

                {/* Preview — mostra imagem atual ou a nova selecionada */}
                {imagePreview && (
                  <div className="mt-2 text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '300px',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6',
                      }}
                    />
                  </div>
                )}

                <label className="form-label mt-2">Nome</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Digite o nome"
                  value={novoProduto}
                  onChange={handleChangeProduto}
                />

                <div className="row align-items-start">
                  <div className="col">
                    <label className="form-label mt-2">Preço</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0,00"
                      value={novoPreco}
                      onChange={handleChangePreco}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label mt-2">Quantidade</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0"
                      value={novoEstoque}
                      onChange={handleChangeEstoque}
                    />
                  </div>
                </div>

                <label className="form-label mt-2">Categoria</label>
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
                  <select className="form-select" disabled>
                    <option>Nenhuma categoria cadastrada</option>
                  </select>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
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

export default ModalEditProduto;
