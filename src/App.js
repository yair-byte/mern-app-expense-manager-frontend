import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './components/Home.jsx';
import Gastos from './components/Gastos.jsx';
import InputEntrante from './components/InputEntrante.jsx';
import InputGasto from './components/InputGasto.jsx';
import Entrantes from './components/Entrantes.jsx'
import './stylesheets/MediaQuerys.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="container-fluid d-flex flex-column text-center font-responsive">
          <nav className="navbar bg-primary navbar-expand-lg bg-body-tertiary bg-color">
            <div className="container-fluid">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/home">Resumen</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/gastos">Gastos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/entrantes">Entrantes</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/entrantes" element={<Entrantes />} />
          <Route path="/inputGasto" element={<InputGasto />} />
          <Route path="/inputEntrante" element={<InputEntrante />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
