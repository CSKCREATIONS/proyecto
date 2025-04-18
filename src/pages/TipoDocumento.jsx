import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import EncabezadoModuloSIGTD from '../components/EncabezadoModuloSIGTD'
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Swal from 'sweetalert2'





export default function TipoDocumento() {

    const handleClick = () => 
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: '¡Listo!',
            text: 'El Tipo de Documento ha sido borrado.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      });

  
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div className="contenido-modulo">
          <EncabezadoModuloSIGTD />

          <div class="container-tabla">
            <div class="table-container">
              <br />

              <Link to={`/TipoDocumentoAdicionar`} className="icons">
                <button className="btn btn-primary">Adicionar</button>
              </Link>

              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Procedimiento(PRO)</td>
                    <td>
                      {/* Botón de Editar */}
                      <Link to={`/TipoDocumentoEdit`} className="icons">
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </Link>
                      &nbsp;&nbsp;&nbsp;
                      {/* Botón de Eliminar con Modal */}
                      <Link to={`/TipoDocumento`} className="icons" onClick={handleClick}>
                        <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>                      
                      </Link>
                    </td>

                  </tr>
                  <tr>
                    <td>Caracterizacion(CAR)</td>

                    <td>
                      {/* Botón de Editar */}
                      <Link to={`/TipoDocumentoEdit`} className="icons">
                      <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </Link>
                      &nbsp;&nbsp;&nbsp;
                      {/* Botón de Eliminar con Modal */}
                      <Link to={`/TipoDocumento`} className="icons" onClick={handleClick}>
                        <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>                      
                      </Link>

                    </td>

                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
