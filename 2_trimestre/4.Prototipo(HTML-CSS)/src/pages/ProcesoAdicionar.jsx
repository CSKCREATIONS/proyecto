import React from "react";
import Fijo from "../components/Fijo";
import { Link } from "react-router-dom";

export default function Proceso() {
  return (
    <div>
      <Fijo />
      <div className="content">

        <div className="form-container">
          <h2 className="title">Añadir Proceso</h2>

          <form className="form">
            <label className="label">Código</label>
            <input type="text" className="input-box" />
            <br />
            <label className="label">Nombre</label>
            <input
              type="text"
              className="input-box"
              
            />

            <label className="label">Responsable</label>
            <textarea
              className="textarea-box"
              
            ></textarea>

            {/* Botones */}
            <div className="button-group">
              <button className="button accept">Adicionar</button>
              <Link to={`/Proceso`}>
                <button className="button cancel">Cancelar</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
