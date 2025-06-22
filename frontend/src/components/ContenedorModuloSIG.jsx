import React from 'react'
import { Link } from 'react-router-dom'

export default function ContenedorModuloSIG() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Compras</legend>
          <div className="botones-container">
            <Link as={Link} to="/InformacionDeFuente" >
              <button className="boton">
                <img src="https://cdn-icons-png.flaticon.com/128/943/943593.png" alt="" className="icono" />
                <span>Lista de compras</span>
              </button>
            </Link>
            <Link as={Link} to="/Documentacion" >
              <button className="boton">
                <img src="https://cdn-icons-png.flaticon.com/128/3175/3175530.png" alt="" className="icono" />
                <span>Proveedores</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
