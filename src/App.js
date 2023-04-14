import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import Gastos from './components/Gastos.jsx';
import InputEntrante from './components/InputEntrante.jsx';
import InputGasto from './components/InputGasto.jsx';
import Entrantes from './components/Entrantes.jsx'
import './stylesheets/MediaQuerys.css';

function App() {

  return (
    <>
      <div className="container-fluid d-flex flex-column text-center font-responsive">
        <nav className="navbar bg-primary navbar-expand-lg bg-body-tertiary bg-color">
          <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/home">Resumen</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/gastos">Gastos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/entrantes">Entrantes</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <BrowserRouter>
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
