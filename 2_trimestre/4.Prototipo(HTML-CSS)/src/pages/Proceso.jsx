import React, { useState } from "react";
import Fijo from "../components/Fijo";
import NavDocumentacion from "../components/NavDocumentacion";
import { Link } from "react-router-dom";

export default function Proceso() {


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavDocumentacion />
        <div>
          {/* Botón de Adicionar */}
          <Link to={`/ProcesoAdicionar`} className="icons">
            <button className="button">Adicionar</button>
          </Link>

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
                      <i
                        className="fa-solid fa-trash icons"
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      ></i>
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
