import Navbar from '../components/Navbar';

const Dashboard = () => (
  <div className="d-flex flex-column min-vh-100">
    <div>
      <Navbar />
    </div>
    <div className="container mt-4 flex-grow-1 p-4">
      <h1>Projeto</h1>
    </div>
  </div>
);

export default Dashboard;
