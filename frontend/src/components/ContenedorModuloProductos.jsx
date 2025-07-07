import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function ContenedorModuloProductos() {
  const [puedeVerCategorias, setPuedeVerCategorias] = useState(false);
  const [puedeVerSubcategorias, setPuedeVerSubcategorias] = useState(false);
  const [puedeVerProductos, setPuedeVerProductos] = useState(false);
  const [puedeVerReportesProductos, setPuedeVerReportesProductos] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeVerCategorias(usuario.permissions.includes('categorias.ver'));
      setPuedeVerSubcategorias(usuario.permissions.includes('subcategorias.ver'));
      setPuedeVerProductos(usuario.permissions.includes('productos.ver'));
      setPuedeVerReportesProductos(usuario.permissions.includes('reportesProductos.ver'));
    }
  }, []);
  return (
    <div className="contenedor-modulo">
      {(puedeVerCategorias || puedeVerProductos || puedeVerSubcategorias) && (
        <section className="seccion">
        <fieldset>
          <legend>Productos</legend>
          <div className="botones-container">
            {puedeVerCategorias && (
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
            )}

            {puedeVerSubcategorias && (
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
            )}

            {puedeVerProductos && (
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
            )}

            {puedeVerReportesProductos && (
              <Link to="/ReporteProductos">
                <button className="boton">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3081/3081559.png"
                    alt="Productos"
                    className="icono"
                  />
                  <span>Reportes productos</span>
                </button>
              </Link>
            )}

          </div>
        </fieldset>
      </section>
      )}
      
    </div>
  );
}
