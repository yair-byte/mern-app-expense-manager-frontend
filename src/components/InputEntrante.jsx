import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../stylesheets/MediaQuerys.css';
import { API_URL } from '../config.js';

function InputEntrante() {

  const [inputFecha, setInputFecha] = useState(new Date());
  const [inputMonto, setInputMonto] = useState(0);
  const [redirectHome, setRedirectHome] = useState(false);

  const handlerCancelar = () => {
    setRedirectHome(true);
  }

  const handlerNewMonto = e => {
    setInputMonto(parseInt(e.target.value));
  }

  const handlerNewFecha = (date) => {
    setInputFecha(date);
  }

  const handlerEnvioUpdate = async (e) => {
    e.preventDefault();
    const fechita = new Date(inputFecha.setHours(0, 0, 0));
    try {
      const newEntrante = {
        monto: inputMonto,
        fecha: fechita
      }
      await axios.post(`${API_URL}/api/entrantes/`, newEntrante);
      setRedirectHome(true);
      Swal.fire({
        title: 'Exito!',
        text: 'La entrada se agregó satisfactoriamente!',
        icon: 'success'
      });
    } catch {
      Swal.fire({
        title: 'Ooops..',
        text: 'Ocurrio un error inesperado!',
        icon: 'error'
      });
    }
  }

  return (
    <div className="container-fluid mb-3 font-responsive">
      <h3 className="text-center mt-3">Añadir una nueva entrada</h3>
      <div>
        <form onSubmit={handlerEnvioUpdate}>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput2" className="form-label">Monto $</label>
            <input
              className='form-control font-responsive'
              type='text'
              placeholder='coloque el monto'
              name='monto'
              onChange={handlerNewMonto}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput3" className="form-label">Fecha</label>
            <DatePicker
              className='form-control font-responsive'
              selected={inputFecha}
              onChange={handlerNewFecha}
              required
            />
          </div>
          <div className="btn-group " role="group">
            <button type="submit" className="btn btn-primary font-responsive">Confirmar</button>
            <button type="button" className="btn btn-secondary font-responsive" onClick={handlerCancelar}>Cancelar</button>
          </div>
          {redirectHome && <Navigate to="/" />}
        </form>
      </div>
    </div>
  );
}

export default InputEntrante;