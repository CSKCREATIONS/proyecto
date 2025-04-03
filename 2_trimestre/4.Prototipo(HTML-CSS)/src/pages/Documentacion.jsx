import React from 'react'
import Fijo from '../components/Fijo'
import EncabezadoModuloSIGDOC from '../components/EncabezadoModuloSIGDOC'
import EditarUsuario from '../components/EditarUsuario'
import ConfirmarAccion from '../components/ConfirmarAccion'
import NavDocumentacion from '../components/NavDocumentacion'
import { Link } from "react-router-dom";

export default function Documentacion() {
  return (
    <div >
      <Fijo />
      <div className="content">
        <NavDocumentacion/>
        <div className="contenido-modulo">
          <EncabezadoModuloSIGDOC/>

          <div className="container-tabla">
            <div className="table-container"><br />
            <Link to={`/DocumentacionAdicionar`} className="icons">
              <button className="button">Adicionar</button>
               </Link>
              <table>
                <thead>
                  <tr>
                    <th>Inactivar/Activar</th>
                    <th>Contenido</th>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Version</th>
                    <th>Tipo de documento</th>
                    <th>Proceso</th>
                    <th>Trazabilidad</th>
                    <th>Versión nueva</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>105323234</td>
                    <td>Natalia Maria</td>
                    <td>Admin</td>
                    <td>Nat@gmail.com</td>
                    <td>Natalia.Mar</td>
                    <td>30204342</td>
                    <td>Habilitado</td>
                    <td>20/03/2025</td>
                    <td>+</td>
                    <td>
                    <button className="button">Editar</button>
                      <Link to={`/TipoDocumento`} className="icons">
                      <button className="button-cancel">Borrar</button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EditarUsuario/>
        <ConfirmarAccion/>
        

      </div>
    </div>
  )
}