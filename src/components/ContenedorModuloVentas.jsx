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
                <img src="https://cdn-icons-png.freepik.com/256/7115/7115894.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Agendar venta</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosAgendados" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/12155/12155326.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Pedidos agendados</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosEntregados" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/2711/2711224.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Pedidos entregados</span>
              </button>
            </Link>
            <Link as={Link} to="/Devoluciones" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/11153/11153370.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Devoluciones</span>
              </button>
            </Link>
            <Link as={Link} to="/PedidosCancelados" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/1136/1136923.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Pedidos cancelados</span>
              </button>
            </Link>
            <Link as={Link} to="/RegistrarCotizacion" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/14185/14185243.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Registrar cotizacion</span>
              </button>
            </Link>
            <Link as={Link} to="/ListaDeCotizaciones" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/2666/2666436.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Lista de cotizaciones</span>
              </button>
            </Link>
            <Link as={Link} to="/ListaDeClientes" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/3239/3239045.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Lista de clientes</span>
              </button>
            </Link>
            <Link as={Link} to="/ProspectosDeClientes" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/901/901407.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Prospectos de cliente</span>
              </button>
            </Link>
            
          </div>
        </fieldset>
      </section>
    </div>
  )
}