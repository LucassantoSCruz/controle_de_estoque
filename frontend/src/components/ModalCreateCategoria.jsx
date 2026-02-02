import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { ENDERECO_API } from '../config';

const ModalCreateCategoria = () => {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(null);
  const [novaCategoria, setNovaCategoria] = useState('');

  useEffect(() => {
    setModal(new Modal(modalRef.current));
    return () => modal?.dispose();
  }, []);

  const openModal = () => modal?.show();
  const closeModal = () => modal?.hide();

  function handleChange(e) {
    setNovaCategoria(e.target.value);
  }

  function handleSubmit(e) {
    axios
      .post(ENDERECO_API + '/cadastrarCategoria', {
        nome_categoria: novaCategoria,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openModal}>
        Cadastrar Categoria
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
                  Cadastrar Categoria
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
                <input
                  class="form-control"
                  type="text"
                  placeholder="Nome da Categoria"
                  value={novaCategoria}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Fechar
                </button>
                <button type="submit" className="btn btn-primary">
                  Cadastrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalCreateCategoria;
