import { useEffect, useRef } from 'react';
import { Toast as BsToast } from 'bootstrap';

const Toast = ({ mensagem, tipo = 'success' }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (mensagem) {
      const toast = new BsToast(toastRef.current, { delay: 3000 });
      toast.show();
    }
  }, [mensagem]);

  const estilos = {
    success: { classe: 'bg-success', icone: '✓', titulo: 'Sucesso' },
    danger: { classe: 'bg-danger', icone: '✕', titulo: 'Erro' },
  };

  const { classe, icone, titulo } = estilos[tipo];

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div ref={toastRef} className={`toast text-white ${classe}`} role="alert">
        <div className="toast-header text-white">
          <strong className="me-auto">
            {icone} {titulo}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
          />
        </div>
        <div className="toast-body">{mensagem}</div>
      </div>
    </div>
  );
};

export default Toast;
