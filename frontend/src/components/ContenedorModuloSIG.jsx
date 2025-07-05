import React from 'react';
import { Link } from 'react-router-dom';

export default function ContenedorModuloSIG() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Compras</legend>
          <div className="botones-container">
            <Link to="/Proveedores">
              <button className="boton">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/942/942751.png"
                  alt="Proveedores"
                  className="icono"
                />
                <span>Proveedores</span>
              </button>
            </Link>
            <Link to="/historialCompras">
              <button className="boton">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2921/2921222.png"
                  alt="Historial de compras"
                  className="icono"
                />
                <span>Historial de compras</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  );
}
