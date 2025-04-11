import React from 'react'
import { closeModal } from '../funciones/animaciones'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


export default function AgendarCotPed() {

    const handleClick = () => {
        Swal.fire({
          text: 'La cotizacion fue agendada correctamente',
          icon: 'success',
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          closeModal('editUserModal'); // cerrar después de aceptar
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
                    <Link to={`/PedidosAgendados`}>
                    <button className="btn btn-primary" onClick={handleClick}>Guardar Cambios</button>
                    </Link>
                </div>
            </div>
                
            </div>
            </div>

        </div>
    )
}
