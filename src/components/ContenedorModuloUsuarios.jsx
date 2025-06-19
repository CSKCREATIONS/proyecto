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
                <img src="https://cdn-icons-png.freepik.com/256/7169/7169774.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Lista de usuarios</span>
              </button>
            </Link>
            <Link as={Link} to="/RolesYPermisos" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/5507/5507771.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Roles y permisos</span>
              </button>
            </Link>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
