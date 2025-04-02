import React from 'react'
import { Link } from 'react-router-dom'

export default function ContenedorModuloSIG() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>SIG</legend>
          <div className="botones-container">
            <Link as={Link} to="/InformacionDeFuente" >
              <button className="boton">
                <img src="https://cdn-icons-png.flaticon.com/128/943/943593.png" alt="" className="icono" />
                <span>Información de fuente</span>
              </button>
            </Link>
            <Link as={Link} to="/Documentacion" >
              <button className="boton">
                <img src="https://cdn-icons-png.flaticon.com/128/3175/3175530.png" alt="" className="icono" />
                <span>Documentación</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
