import React from 'react'
import { Link } from 'react-router-dom'

export default function ContenedorModuloUsuarios() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Usuarios</legend>
          <div className="botones-container">
            <Link as={Link} to="/ListaDeUsuarios" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Lista de usuarios</span>
              </button>
            </Link>
            <Link as={Link} to="/AñadirUsuario" >
              <button className="boton">
                <img src="https://cdn-icons-png.flaticon.com/128/1177/1177577.png" alt="" className="icono" />
                <span>Añadir usuario</span>
              </button>
            </Link>
            <Link as={Link} to="/AñadirUsuario" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Añadir rol</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
