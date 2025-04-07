import React from 'react'
import { Link } from 'react-router-dom'

export default function ContenedorModuloVentas() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Ventas</legend>
          <div className="botones-container">
            <Link as={Link} to="/AgendarVenta" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Agendar venta</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosAgendados" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Pedidos agendados</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosEntregados" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Pedidos entragados</span>
              </button>
            </Link>
            <Link as={Link} to="/Devoluciones" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Devoluciones</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosCancelados" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Pedidos cancelados</span>
              </button>
            </Link>
            <Link as={Link} to="/RegistrarCotizacion" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Registrar cotizacion</span>
              </button>
            </Link>
            <Link as={Link} to="/ListaDeCotizaciones" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Lista de cotizaciones</span>
              </button>
            </Link>
            <Link as={Link} to="/ListaDeClientes" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Lista de clientes</span>
              </button>
            </Link>
            <Link as={Link} to="/ProspectosDeCliente" >
              <button className="boton">
                <img src="" alt="" className="icono" />
                <span>Prospectos de cliente</span>
              </button>
            </Link>
            
          </div>
        </fieldset>
      </section>
    </div>
  )
}