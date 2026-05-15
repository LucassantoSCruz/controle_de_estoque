import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: '#1a3c62' }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 text-white"
          to="/"
        >
          <img src={logo} alt="Logo" width="48" height="48" />
          Controle de Estoque
        </Link>

        <button
          className="navbar-toggler border-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: 'invert(1)' }}
          />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {[
              { to: '/', label: 'Home' },
              { to: '/categories', label: 'Categorias' },
              { to: '/products', label: 'Produtos' },
              { to: '/movimentacoes', label: 'Movimentações' },
            ].map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <Link
                  className={`nav-link text-white ${pathname === to ? 'fw-bold' : ''}`}
                  to={to}
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="nav-item ms-3">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('nome');
                  window.location.href = '/login';
                }}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
