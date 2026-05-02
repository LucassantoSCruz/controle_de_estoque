import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { ENDERECO_API } from '../config';
import Toast from './Toast';

const ModalCreateProduto = ({ onProdutoCadastrado }) => {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [novoProduto, setNovoProduto] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novoEstoque, setNovoEstoque] = useState('');
  const [novoCodCategoria, setNovoCodCategoria] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [erro, setErro] = useState('');
  const [listagemCategoria, setListagemCategoria] = useState([]);
  const [toast, setToast] = useState({ mensagem: '', tipo: 'success' });

  useEffect(() => {
    setModal(new Modal(modalRef.current));
    return () => modal?.dispose();
  }, []);

  useEffect(() => {
    axios
      .get(ENDERECO_API + '/listarCategoria')
      .then((response) => setListagemCategoria(response.data.data))
      .catch((error) => console.log('Erro ao buscar categorias:', error));
  }, []);

  const openModal = () => {
    setErro('');
    modal?.show();
  };
  const closeModal = () => modal?.hide();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!novoProduto || !novoPreco || !novoEstoque || !novoCodCategoria) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (Number(novoPreco) < 0 || Number(novoEstoque) < 0) {
      setErro('Preço e quantidade não podem ser negativos.');
      return;
    }

    setErro('');

    const formData = new FormData();
    formData.append('nome_produto', novoProduto);
    formData.append('preco_produto', novoPreco);
    formData.append('estoque_atual', novoEstoque);
    formData.append('cod_categoria', novoCodCategoria);
    if (image) formData.append('image', image);

    axios
      .post(ENDERECO_API + '/cadastrarProduto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response);
        setNovoProduto('');
        setNovoPreco('');
        setNovoEstoque('');
        setNovoCodCategoria('');
        setImage(null);
        setImagePreview(null);
        setErro('');
        closeModal();
        setToast({
          mensagem: 'Produto cadastrado com sucesso!',
          tipo: 'success',
        });
        onProdutoCadastrado(); // 👈 atualiza a lista
      })
      .catch((error) => {
        console.log(error);
        setToast({ mensagem: 'Erro ao cadastrar produto.', tipo: 'danger' });
      });
  }

  return (
    <>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} />

      <button type="button" className="btn btn-primary" onClick={openModal}>
        Cadastrar Produto
      </button>

      <div
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Cadastrar Produto
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                />
              </div>

              <div className="modal-body">
                {erro && <div className="alert alert-danger py-2">{erro}</div>}

                <label className="form-label">Imagem do produto</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />

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
                  onChange={(e) => setNovoProduto(e.target.value)}
                />

                <div className="row align-items-start">
                  <div className="col">
                    <label className="form-label mt-2">Preço</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0,00"
                      min="0"
                      value={novoPreco}
                      onChange={(e) => setNovoPreco(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label mt-2">Quantidade</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={novoEstoque}
                      onChange={(e) => setNovoEstoque(e.target.value)}
                    />
                  </div>
                </div>

                <label className="form-label mt-2">Categoria</label>
                {Array.isArray(listagemCategoria) &&
                listagemCategoria.length > 0 ? (
                  <select
                    className="form-select"
                    value={novoCodCategoria}
                    onChange={(e) => setNovoCodCategoria(e.target.value)}
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

export default ModalCreateProduto;
