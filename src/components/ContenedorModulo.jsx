import React from 'react'

export default function ContenedorModulo(props) {
  return (
    <div className="contenedor-modulo">
       <section className="seccion">
        <fieldset>
          <legend>{props.modulo}</legend>
          <div className="botones-container">
            <button className="boton">
              <img alt="" className="icono" />
              <span>Lista de usuarios</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Añadir usuario</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Añadir rol</span>
            </button>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
