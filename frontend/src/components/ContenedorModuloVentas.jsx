import React from 'react';
import { Link } from 'react-router-dom';

export default function ContenedorModuloVentas() {
  return (
    <div className="contenedor-modulo">
      <section className="seccion">
        <fieldset>
          <legend>Ventas</legend>
          <div className="botones-container">

            {/* Separador Cotizaciones */}

            <Link to="/RegistrarCotizacion">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/14185/14185243.png" alt="Registrar cotización" className="icono" />
                <span>Registrar cotización</span>
              </button>
            </Link>

            <Link to="/ListaDeCotizaciones">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/2666/2666436.png" alt="Lista de cotizaciones" className="icono" />
                <span>Lista de cotizaciones</span>
              </button>
            </Link>

            {/* Sección de ventas */}
            <Link to="/AgendarVenta">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/7115/7115894.png" alt="Agendar venta" className="icono" />
                <span>Agendar Pedido</span>
              </button>
            </Link>

            <Link to="/PedidosAgendados">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/12155/12155326.png" alt="Pedidos agendados" className="icono" />
                <span>Pedidos agendados</span>
              </button>
            </Link>

            <Link to="/PedidosEntregados">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/2711/2711224.png" alt="Pedidos entregados" className="icono" />
                <span>Pedidos entregados</span>
              </button>
            </Link>
            

            <Link to="/PedidosCancelados">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/1136/1136923.png" alt="Pedidos cancelados" className="icono" />
                <span>Pedidos cancelados</span>
              </button>
            </Link>

            
            <Link to="/RegistrarCotizacion">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/14185/14185243.png" alt="Registrar cotización" className="icono" />
                <span>Registrar cotización</span>
              </button>
            </Link>

            <Link to="/ListaDeCotizaciones">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/2666/2666436.png" alt="Lista de cotizaciones" className="icono" />
                <span>Lista de cotizaciones</span>
              </button>
            </Link>

           

            <Link to="/ListaDeClientes">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/3239/3239045.png" alt="Lista de clientes" className="icono" />
                <span>Lista de clientes</span>
              </button>
            </Link>

            <Link to="/ProspectosDeClientes">
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/901/901407.png" alt="Prospectos de cliente" className="icono" />
                <span>Prospectos de cliente</span>
              </button>
            </Link>

          </div>
        </fieldset>
      </section>
    </div>
  );
}
