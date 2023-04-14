import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/Gastos.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import '../stylesheets/MediaQuerys.css';
import { API_URL } from '../config.js';

function Gastos() {

  const [datosCategoria, setDatosCategoria] = useState({});
  const [ordenGastos, setOrdenGastos] = useState('fdesc');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [gastoToChange, setGastoToChange] = useState({});
  const [inputFecha, setInputFecha] = useState(new Date());
  const [inputMonto, setInputMonto] = useState(0);
  const [inputCategoria, setInputCategoria] = useState('');

  const obtenerGastosDetalleCategorias = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/gastos`);
      const categorias = [...new Set(data.map((gasto) => gasto.categoria))];
      const gastosPorCategoria = {};
      for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const response = await axios.get(`${API_URL}/api/gastos/${categoria}`, {
          params: {
            orden: ordenGastos
          }
        });
        const gastos = response.data.map((gasto) => ({
          ...gasto,
          fecha: new Date(gasto.fecha)
        }));
        gastosPorCategoria[categoria] = gastos;
      }
      setDatosCategoria(gastosPorCategoria);
    } catch (error) {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  const handlerDeleteGasto = async (catg, id) => {
    const result = await Swal.fire({
      title: 'Advertencia!',
      text: '¿Desea eliminar el gasto seleccionado?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/gastos/${id}`);
        const newGastos = datosCategoria[catg].filter(gasto => gasto._id !== id);
        const newObjectGastos = { ...datosCategoria, [catg]: newGastos };
        setDatosCategoria(newObjectGastos);
        await Swal.fire({
          title: 'Exito!',
          icon: 'success',
          text: 'El gasto fue eliminado satisfactoriamente'
        });
      } catch (error) {
        await Swal.fire({
          title: 'Ooops..',
          text: 'Ocurrio un error inesperado!',
          icon: 'error'
        });
      }
    } else if (result.isDenied) {
      // do nothing
    }
  };

  const handlerUpdateGasto = (gasto) => {
    setInputCategoria(gasto.categoria);
    setInputMonto(gasto.cantidad);
    setInputFecha(gasto.fecha);
    setGastoToChange(gasto);
    setShowUpdateForm(true);
  }

  const handleClick = (op) => {
    setOrdenGastos(op);
  }

  const handlerReset = () => {
    setInputCategoria(gastoToChange.categoria);
    setInputMonto(parseInt(gastoToChange.cantidad));
    setInputFecha(gastoToChange.fecha);
  }

  async function handlerEnvioUpdate(e) {
    e.preventDefault();
    const fechita = new Date(inputFecha.setHours(0, 0, 0));
    const newGastoToUpdate = {
      categoria: inputCategoria,
      cantidad: inputMonto,
      fecha: fechita
    };
    try {
      await axios.put(`${API_URL}/api/gastos/${gastoToChange._id}`, newGastoToUpdate);
      //le pedimos  a la API nuevamente todos los datos actualizados...
      obtenerGastosDetalleCategorias();
    } catch {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
    setShowUpdateForm(false);
  }


  const handlerNewCategoria = e => {
    setInputCategoria(e.target.value);
  }

  const handlerNewMonto = e => {
    setInputMonto(parseInt(e.target.value));
  }

  const handlerNewFecha = (date) => {
    setInputFecha(date);
  }

  useEffect(() => {
    //pedir al server los datos de cada categoria
    obtenerGastosDetalleCategorias();
  }, [ordenGastos]);

  return (
    <div className="container-fluid mb-3 font-responsive">
      {showUpdateForm ?
        (<>
          <h3 className="text-center mt-3">Actualizacion de Gasto</h3>
          <div>
            <form onSubmit={handlerEnvioUpdate} onReset={handlerReset}>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput" className="form-label">Nueva categoria</label>
                <input
                  className='form-control font-responsive'
                  type='text'
                  placeholder={gastoToChange.categoria}
                  name='categoria'
                  onChange={handlerNewCategoria}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">Nuevo monto $</label>
                <input
                  className='form-control font-responsive'
                  type='text'
                  placeholder={gastoToChange.cantidad}
                  name='monto'
                  onChange={handlerNewMonto}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput3" className="form-label">Nueva fecha</label>
                <DatePicker
                  className='form-control font-responsive'
                  selected={inputFecha}
                  onChange={handlerNewFecha}
                  required
                />
              </div>
              <div className="btn-group" role="group">
                <button type="submit" className="btn btn-primary font-responsive">Confirmar</button>
                <button type="reset" className="btn btn-secondary font-responsive">Restablecer</button>
              </div>
            </form>
          </div>
        </>)
        :
        (<>

          <div className="d-flex justify-content-end">
            <div id="botones-orden" className="btn-group">
              <a className="btn btn-primary" onClick={() => handleClick('fdesc')}>◔↑</a>
              <a className="btn btn-primary" onClick={() => handleClick('fasc')}>◔↓</a>
              <a className="btn btn-primary" onClick={() => handleClick('cdesc')}>$↑</a>
              <a className="btn btn-primary" onClick={() => handleClick('casc')}>$↓</a>
            </div>
          </div>
          {Object.keys(datosCategoria).length === 0 ? (<h4>No hay gastos para mostrar</h4>) : (
            Object.keys(datosCategoria).map(categoria => (
              <div key={categoria} className="container-fluid">
                <h4>{categoria}</h4>
                <table className="table table-fixed" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Monto</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosCategoria[categoria].map((item, i) => (
                      <tr key={i}>
                        <th scope="row">{i}</th>
                        <td>{item.cantidad}$</td>
                        <td>{item.fecha.toLocaleDateString('es-ES')}</td>
                        <td>
                          <div id="botones-uptd-del" className="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-danger font-responsive" onClick={() => handlerDeleteGasto(item.categoria, item._id)}>Eliminar</button>
                            <button type="button" className="btn btn-warning font-responsive" onClick={() => handlerUpdateGasto(item)}>Modificar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>)
      }
    </div>

  );

}

export default Gastos;