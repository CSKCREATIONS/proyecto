import React from 'react'
import { closeModal } from '../funciones/animaciones'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AgendarCotPed() {

  const navigate = useNavigate();

  const handleClick = () => {
    Swal.fire({
      text: 'La cotización fue agendada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      closeModal('editUserModal');
      navigate('/PedidosAgendados');
    });
  };

  return (
    <div className="modal" id="editUserModal">
      <div className="modal-content">
        <div className="container-tabla">
          <div className="table-container">
            <table id='tabla_cotizaciones'>
              <thead>
                <tr>
                  <th>Nombre / Razón Social</th>
                  <th>Ciudad</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Natalia</td>
                  <td>Bogotá</td>
                  <td>3153234</td>
                  <td>Nataliamaria@gmail</td>
                  <td>Pasto</td>
                  <td>07/04/2027</td>
                  <td>N/A</td>
                </tr>
              </tbody>
            </table>
            <div className="buttons">
              <button className="btn btn-secondary" onClick={() => closeModal('editUserModal')}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleClick}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
