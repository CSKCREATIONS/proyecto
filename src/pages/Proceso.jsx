import React, { useState } from "react";
import Fijo from "../components/Fijo";
import NavDocumentacion from "../components/NavDocumentacion";
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'



export default function Proceso() {


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
            text: 'El proceso ha sido borrado.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      });


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div className="contenido-modulo">
          {/* Botón de Adicionar */}
          <br />
          <Link to={`/ProcesoAdicionar`} className="icons">
            <button className="btn">Adicionar</button>
          </Link>
          <br />
          {/* Tabla de Procesos */}
          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Responsable</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>105323234</td>
                    <td>Natalia Maria</td>
                    <td>Admin</td>
                    <td>
                      {/* Botón de Editar */}
                      <Link to={`/ProcesoEdit`} className="icons">
                        <i className="fa-solid fa-pen" aria-label="Editar"></i>
                      </Link>

                      {/* Botón de Eliminar con Modal */}
                      <Link to={`/Proceso`} className="icons" onClick={handleClick}>
                      <i className="fa-solid fa-trash icons" style={{ cursor: "pointer", marginLeft: "10px" }}
                      >
                        tralalero
                      </i>
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
  );
}
