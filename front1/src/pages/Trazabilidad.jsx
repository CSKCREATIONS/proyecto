import Fijo from '../components/Fijo'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";
import React, { useState } from "react";





export default function TipoDocumento() {

    

  
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div className="contenido-modulo">
            <div>
                <h3>Trazabilidad</h3>
            </div>
          <div class="container-tabla">
            <div class="table-container">
              <br />

              <table>
                <thead>
                  <tr>
                    <th>Versión</th>
                    <th>Acción</th>
                    <th>Observación</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2</td>
                    <td>Editar</td>
                    <td>Cambio de nombre</td>
                    <td>2024-12-03</td>
                    <td>Pepito Perez</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Agregar</td>
                    <td>Creación Documento: PROPUESTA TECNICA PANGEA</td>
                    <td>2024-12-03</td>
                    <td>Pepito Perez</td>
                  </tr>
                </tbody>
              </table> <br />
              <Link to={`/Documentacion`} className="icons">
                <button className="btn">Aceptar</button>
              </Link>

            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
