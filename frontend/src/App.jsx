import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Movimentacoes from './pages/Movimentacoes';
import Login from './pages/Login';
import RotaProtegida from './components/RotaProtegida';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/categories"
            element={
              <RotaProtegida>
                <Categories />
              </RotaProtegida>
            }
          />
          <Route
            path="/products"
            element={
              <RotaProtegida>
                <Products />
              </RotaProtegida>
            }
          />
          <Route
            path="/movimentacoes"
            element={
              <RotaProtegida>
                <Movimentacoes />
              </RotaProtegida>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
