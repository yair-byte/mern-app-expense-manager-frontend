import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart.jsx';
import BarChart from './BarChart.jsx';
import '../stylesheets/Home.css';
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '../stylesheets/MediaQuerys.css';
import { API_URL } from '../config.js';

function Home() {

  const [selectedOption, setSelectedOption] = useState("option1");
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [gastoPeriodo, setGastoPeriodo] = useState(0);
  const [entrantePeriodo, setEntrantePeriodo] = useState(0);
  const [redirectEntrante, setRedirectEntrante] = useState(false);
  const [redirectGasto, setRedirectGasto] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState(false);
  const [gastosPorTiempo, setGastosPorTiempo] = useState([]);

  const handlerButtonEntrante = () => {
    setRedirectEntrante(true);
  };

  const handlerButtonGasto = () => {
    setRedirectGasto(true);
  };

  function getHexColor(percent) {
    // Mapear el porcentaje a un valor de tono entre 240 y 0 grados
    const hue = Math.round(((100 - percent) / 100) * 240);

    // Definir un valor de saturación y luminosidad fijo
    const saturation = 75;
    const lightness = 50;

    // Convertir el color de HSL a hexadecimal
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hexColor = rgbToHex(hslToRgb(hslColor));

    return hexColor;
  }

  function hslToRgb(hsl) {
    // Convertir el valor de HSL a RGB
    const regex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
    const match = regex.exec(hsl);
    const hue = parseInt(match[1]);
    const saturation = parseInt(match[2]) / 100;
    const lightness = parseInt(match[3]) / 100;

    let r, g, b;

    if (saturation === 0) {
      r = g = b = lightness;
    } else {
      const hueToRgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;

      r = hueToRgb(p, q, hue / 360 + 1 / 3);
      g = hueToRgb(p, q, hue / 360);
      b = hueToRgb(p, q, hue / 360 - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHex(rgb) {
    // Convertir el valor de RGB a hexadecimal
    const r = rgb[0].toString(16).padStart(2, '0');
    const g = rgb[1].toString(16).padStart(2, '0');
    const b = rgb[2].toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  async function obtenerGastosPorTiempo(fechas, milis) {
    try {
      let arrayObjetos = new Array(fechas.length);
      for (let i = 0; i < fechas.length; i++) {
        arrayObjetos[i] = { x: '', y: 0 };
      }
      const { data } = await axios.get(`${API_URL}/api/gastos/`);
      const dataFiltrada = data.filter(gasto => {
        return (((new Date(gasto.fecha).getTime()) >= milis) && ((new Date(gasto.fecha).getTime()) <= new Date().getTime()));
      });
      if (selectedOption === 'option1') {
        for (let i = 0; i < fechas.length; i++) {
          let acumulador = 0;
          const fechaBuscada = new Date(fechas[i]);
          dataFiltrada.forEach(function (fechaObjt) {
            if (new Date(fechaObjt.fecha).getDate() === fechaBuscada.getDate()
              && new Date(fechaObjt.fecha).getMonth() === fechaBuscada.getMonth()
              && new Date(fechaObjt.fecha).getFullYear() === fechaBuscada.getFullYear()) {
              acumulador += fechaObjt.cantidad;
            }
          });
          arrayObjetos[i].x = `${fechaBuscada.getDate()}/${fechaBuscada.getMonth() + 1}`;
          arrayObjetos[i].y = acumulador;
        }
      } else if (selectedOption === 'option2') {
        arrayObjetos = new Array(Math.ceil(fechas.length / 2));
        for (let i = 0; i < arrayObjetos.length; i++) {
          arrayObjetos[i] = { x: '', y: 0 };
        }
        const primerDiaMes = new Date(fechas[0]);
        const hoy = new Date(fechas[fechas.length - 1]);
        for (let i = 0; i < fechas.length; i += 2) {
          let acumulador = 0;
          const fecha1 = new Date(fechas[i]);
          const fecha2 = new Date(fechas[i + 1]);
          if (fecha1 >= primerDiaMes && fecha1 <= hoy) {
            let x = '';
            if (isNaN(fecha2.getTime())) {
              x = `${fecha1.getDate()}/${fecha1.getMonth() + 1}`;
            } else {
              x = `${fecha1.getDate()}/${fecha1.getMonth() + 1} - ${fecha2.getDate()}/${fecha2.getMonth() + 1}`;
            }
            dataFiltrada.forEach(fechaObjt => {
              if (new Date(fechaObjt.fecha).getDate() === fecha1.getDate()
                && new Date(fechaObjt.fecha).getMonth() === fecha1.getMonth()
                && new Date(fechaObjt.fecha).getFullYear() === fecha1.getFullYear()) {
                acumulador += fechaObjt.cantidad;
              }
              if (new Date(fechaObjt.fecha).getDate() === fecha2.getDate()
                && new Date(fechaObjt.fecha).getMonth() === fecha2.getMonth()
                && new Date(fechaObjt.fecha).getFullYear() === fecha2.getFullYear()) {
                acumulador += fechaObjt.cantidad;
              }
            });
            arrayObjetos[i / 2] = {
              x,
              y: acumulador
            };
            acumulador = 0;
          }
        }
      } else if (selectedOption === 'option3') {

        for (let i = 0; i < fechas.length; i++) {
          let acumulador = 0;
          const fechaBuscada = new Date(fechas[i]);

          dataFiltrada.forEach(fechaObjt => {

            if (new Date(fechaObjt.fecha).getMonth() === fechaBuscada.getMonth()
              && new Date(fechaObjt.fecha).getFullYear() === fechaBuscada.getFullYear()) {
              acumulador += fechaObjt.cantidad;
            }
          });
          arrayObjetos[i].x = `${fechaBuscada.getMonth() + 1}/${fechaBuscada.getFullYear()}`;
          arrayObjetos[i].y = acumulador;
        }

      } else {
        for (let i = 0; i < fechas.length; i++) {
          let acumulador = 0;
          const fechaBuscada = new Date(fechas[i]);
          dataFiltrada.forEach(fechaObjt => {
            if (new Date(fechaObjt.fecha).getMonth() === fechaBuscada.getMonth()
              && new Date(fechaObjt.fecha).getFullYear() === fechaBuscada.getFullYear()) {
              acumulador += fechaObjt.cantidad;
            }
          });
          arrayObjetos[i].x = `${fechaBuscada.getMonth() + 1}/${fechaBuscada.getFullYear()}`;
          arrayObjetos[i].y = acumulador;
        }
      }
      setGastosPorTiempo(arrayObjetos);
    } catch (error) {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  async function obtenerGastosPorCategoria(milis) {
    try {
      const { data } = await axios.get(`${API_URL}/api/gastos/`);
      const dataFiltrada = data.filter(gasto => {
        return (((new Date(gasto.fecha).getTime()) >= milis) && ((new Date(gasto.fecha).getTime()) <= new Date().getTime()));
      });
      const totalesPorCategoria = dataFiltrada.reduce((acumulador, { categoria, cantidad }) => {
        acumulador[categoria] = (acumulador[categoria] || 0) + cantidad;
        return acumulador;
      }, {});
      const montos = Object.values(totalesPorCategoria);
      const montoTotal = montos.reduce((acumulador, monto) => acumulador + monto, 0);
      const porcentajeDecimal = 100 / montoTotal;
      const gastosPorCategoria = Object.keys(totalesPorCategoria).map((categoria, index) => {
        const monto = totalesPorCategoria[categoria];
        const porcentaje = parseFloat((monto * porcentajeDecimal).toFixed(2));
        return { categoria, cantidad: monto, porcentaje, color: getHexColor(porcentaje) };
      });
      setGastoPeriodo(montoTotal);
      setGastosPorCategoria(gastosPorCategoria);
    } catch (error) {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  async function obtenerEntranteTotal(milis) {
    try {
      const { data } = await axios.get(`${API_URL}/api/entrantes/`);
      const dataFiltrada = data.filter(entrante => {
        return (((new Date(entrante.fecha).getTime()) >= milis) && ((new Date(entrante.fecha).getTime()) <= new Date().getTime()));
      });
      const montoTotal = dataFiltrada.reduce((accumulator, currentValue) => accumulator + currentValue.monto, 0);
      setEntrantePeriodo(montoTotal);
    } catch (error) {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  useEffect(() => {
    const fechaAtras = new Date((new Date()).setHours(0, 0, 0));
    const hoy = new Date((new Date()).setHours(0, 0, 0));
    const fechas = [];
    if (selectedOption === 'option1') {
      fechaAtras.setDate((new Date()).getDate() - 6);
      for (let fecha = new Date(fechaAtras); fecha <= hoy; fecha.setDate(fecha.getDate() + 1)) {
        fechas.push(new Date(fecha));
      }
    } else if (selectedOption === 'option2') {
      fechaAtras.setDate(1);
      for (let fecha = new Date(fechaAtras); fecha <= hoy; fecha.setDate(fecha.getDate() + 1)) {
        fechas.push(new Date(fecha));
      }
    } else if (selectedOption === 'option3') {
      fechaAtras.setMonth((new Date()).getMonth() - 2);
      fechaAtras.setDate(1);
      for (let fecha = new Date(fechaAtras); fecha <= hoy; fecha.setMonth(fecha.getMonth() + 1)) {
        fechas.push(new Date(fecha));
      }
    } else {
      fechaAtras.setMonth(0);
      fechaAtras.setDate(1);
      for (let fecha = new Date(fechaAtras); fecha <= hoy; fecha.setMonth(fecha.getMonth() + 1)) {
        fechas.push(new Date(fecha));
      }
    }
    obtenerGastosPorTiempo(fechas, fechaAtras.getTime())
    obtenerEntranteTotal(fechaAtras.getTime());
    obtenerGastosPorCategoria(fechaAtras.getTime());
  }, [selectedOption]);


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlerSwitch = () => {
    setSelectedSwitch(!selectedSwitch);
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column text-center font-responsive">
        <h1 className="titulo-principal">Resumen</h1>

        <div className="container btn-group selector-periodo" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={selectedOption === "option1"} value="option1" onChange={handleOptionChange} />
          <label className="btn btn-outline-primary font-responsive" htmlFor="btnradio1">Semana</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={selectedOption === "option2"} value="option2" onChange={handleOptionChange} />
          <label className="btn btn-outline-primary font-responsive" htmlFor="btnradio2">Mes</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" checked={selectedOption === "option3"} value="option3" onChange={handleOptionChange} />
          <label className="btn btn-outline-primary font-responsive" htmlFor="btnradio3">Trimestre</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" checked={selectedOption === "option4"} value="option4" onChange={handleOptionChange} />
          <label className="btn btn-outline-primary font-responsive" htmlFor="btnradio4">Año</label>
        </div>

        <div className="container gastos font-responsive">
          <div className="row">
            <div className="col-6">
              <p>
                Entrante:
              </p>
            </div>
            <div className="col-6">
              <p id="positivo">
                {entrantePeriodo}$
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>
                Gastos:
              </p>
            </div>
            <div className="col-6">
              <p id="negativo">
                {gastoPeriodo}$
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>
                Restante:
              </p>
            </div>
            <div className="col-6">
              {entrantePeriodo - gastoPeriodo < 0 ? (<p id="negativo">{entrantePeriodo - gastoPeriodo}$</p>) : (<p id="positivo">{entrantePeriodo - gastoPeriodo}$</p>)}
            </div>
          </div>
        </div>

        <div className="container botones-principales">
          <div className="row justify-content-between">
            <div className="col-6 d-flex justify-content-end">
              <button type="button" onClick={handlerButtonEntrante} className="btn btn-success w-100 mx-auto font-responsive">Añadir entrante</button>
            </div>
            <div className="col-6 d-flex justify-content-start">
              <button type="button" onClick={handlerButtonGasto} className="btn btn-danger w-100 mx-auto font-responsive">Añadir gasto</button>
            </div>
          </div>
          {redirectEntrante && <Navigate to="/inputEntrante" />}
          {redirectGasto && <Navigate to="/inputGasto" />}
        </div>

        <h3>Mis Gastos</h3>

        <div className="container text-center d-flex justify-content-center flex-row">
          {gastoPeriodo === 0 ? (
            <h4>No hay Gastos para el periodo seleccionado</h4>
          ) : (
            <>
              {selectedSwitch ? (
                <BarChart data={gastosPorTiempo} type={selectedOption} />
              ) : (
                <PieChart gastosPorCategoria={gastosPorCategoria} />
              )}
              <div className="form-check form-switch text-center d-flex justify-content-start flex-column align-items-center switch-container">
                {selectedSwitch ? (
                  <i className="bi bi-bar-chart-line-fill"></i>
                ) : (
                  <i className="bi bi-pie-chart-fill"></i>
                )}
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    onChange={handlerSwitch}
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                  />
                  <label
                    className="form-check-label mb-0"
                    htmlFor="flexSwitchCheckChecked"
                  ></label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="container contenedor-gastos-categoria">
          {
            gastosPorCategoria.map((gasto, index) =>
              <div className="row" key={index}>
                <div className="col-2 d-flex align-items-center justify-content-center">
                  <i className="bi bi-circle-fill" style={{ color: gasto.color }}></i>
                </div>
                <div className="col-10">
                  <div className="row">
                    <div className="col-6 d-flex align-items-flex-start">
                      {gasto.categoria}
                    </div>
                    <div id="negativo" className="col-6 d-flex justify-content-end">
                      -{gasto.cantidad}$
                    </div>
                  </div>
                  <div className="row">
                    <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow={gasto.porcentaje} aria-valuemin="0" aria-valuemax="100">
                      <div className="progress-bar" style={{ width: `${gasto.porcentaje}%`, backgroundColor: `${gasto.color}` }}>{gasto.porcentaje}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default Home;