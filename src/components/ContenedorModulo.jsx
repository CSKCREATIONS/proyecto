import React from 'react';

export default function ContenedorModulo() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Usuarios</legend>
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

      <section className="seccion">
        <fieldset>
          <legend>Ventas</legend>
          <div className="botones-container">
            <button className="boton">
              <img alt="" className="icono" />
              <span>Agendar venta</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Pedidos Agendados</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Pedidos entregados</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Devoluciones</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Pedidos cancelados</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Registrar cotización</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Lista de cotizaciones</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Lista de clientes</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Prospectos cliente</span>
            </button>
          </div>
        </fieldset>
      </section>

      <section className="seccion">
        <fieldset>
          <legend>SIG</legend>
          <div className="botones-container">
            <button className="boton">
              <img alt="" className="icono" />
              <span>Información de fuente</span>
            </button>
            <button className="boton">
              <img alt="" className="icono" />
              <span>Documentación</span>
            </button>
          </div>
        </fieldset>
      </section>
    </div>
  );
}

