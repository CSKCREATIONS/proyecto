import React from 'react';
import { Link } from 'react-router-dom';

export default function ContenedorModuloSIG() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Productos</legend>
          <div className="botones-container">
            <Link to="/categorias">
              <button className="boton">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/10522/10522934.png"
                  alt="Categorías"
                  className="icono"
                />
                <span>Categorías</span>
              </button>
            </Link>
            <Link to="/subcategorias">
              <button className="boton">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                  alt="Subcategorías"
                  className="icono"
                />
                <span>Subcategorías</span>
              </button>
            </Link>
            <Link to="/GestionProductos">
              <button className="boton">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3081/3081559.png"
                  alt="Productos"
                  className="icono"
                />
                <span>Productos</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  );
}
