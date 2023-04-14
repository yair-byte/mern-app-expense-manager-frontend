import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import '../stylesheets/MediaQuerys.css';

function Entrantes() {

  const [datosEntrantes, setDatosEntrantes] = useState([]);
  const [ordenEntrantes, setOrdenEntrantes] = useState('fdesc');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [entranteToChange, setEntranteToChange] = useState({});
  const [inputFecha, setInputFecha] = useState(new Date());
  const [inputMonto, setInputMonto] = useState(0);

  const obtenerEntrantes = async () => {
    try {
      const { data } = await axios.get('/api/entrantes', {
        params: {
          orden: ordenEntrantes
        }
      });
      const newData = data.map((entranteObj) => {
        return {
          ...entranteObj,
          fecha: new Date(entranteObj.fecha)
        };
      });
      setDatosEntrantes(newData);
    } catch (error) {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  const handlerDeleteEntrante = async (id) => {
    const result = await Swal.fire({
      title: 'Advertencia!',
      text: '¿Desea eliminar la entrada seleccionada?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/entrantes/${id}`);
        const newEntrantes = datosEntrantes.filter(entrada => entrada._id !== id);
        setDatosEntrantes(newEntrantes);
        await Swal.fire({
          title: 'Exito!',
          icon: 'success',
          text: 'La entrada fue eliminada satisfactoriamente'
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

  const handlerUpdateEntrante = (entrante) => {
    setInputMonto(entrante.monto);
    setInputFecha(entrante.fecha);
    setEntranteToChange(entrante);
    setShowUpdateForm(true);
  }

  const handleClick = (op) => {
    setOrdenEntrantes(op);
  }

  const handlerReset = () => {
    setInputMonto(parseInt(entranteToChange.monto));
    setInputFecha(entranteToChange.fecha);
  }

  async function handlerEnvioUpdate(e) {
    e.preventDefault();
    const fechita = new Date(inputFecha.setHours(0, 0, 0));
    const newEntradaToUpdate = {
      monto: inputMonto,
      fecha: fechita
    };
    try {
      await axios.put(`/api/entrantes/${entranteToChange._id}`, newEntradaToUpdate);
      //le pedimos  a la API nuevamente todos los datos actualizados...
      obtenerEntrantes();
    } catch {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
    setShowUpdateForm(false);
  }

  const handlerNewMonto = e => {
    setInputMonto(parseInt(e.target.value));
  }

  const handlerNewFecha = (date) => {
    setInputFecha(date);
  }

  useEffect(() => {
    //pedir al server los datos
    obtenerEntrantes();
  }, [ordenEntrantes]);

  return (
    <div className="container-fluid mb-3 font-responsive">
      {showUpdateForm ?
        (<>
          <h3 className="text-center mt-3">Actualizacion de Entrantes</h3>
          <div>
            <form onSubmit={handlerEnvioUpdate} onReset={handlerReset}>
              <div className="mb-3">
                <label htmlFor="formGroupExampleInput2" className="form-label">Nuevo monto $</label>
                <input
                  className='form-control font-responsive'
                  type='text'
                  placeholder={entranteToChange.monto}
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

          {(datosEntrantes).length === 0 ? (<h4>No hay entradas para mostrar</h4>) : (

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
                {datosEntrantes.map((entranteObj, i) => (
                  <tr key={entranteObj._id}>
                    <th scope="row">{i}</th>
                    <td>{entranteObj.monto}$</td>
                    <td>{entranteObj.fecha.toLocaleDateString('es-ES')}</td>
                    <td>
                      <div id="botones-uptd-del" className="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" className="btn btn-danger font-responsive" onClick={() => handlerDeleteEntrante(entranteObj._id)}>Eliminar</button>
                        <button type="button" className="btn btn-warning font-responsive" onClick={() => handlerUpdateEntrante(entranteObj)}>Modificar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


        </>)
      }
    </div>

  );

}

export default Entrantes;