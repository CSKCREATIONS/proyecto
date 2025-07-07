import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContenedorModuloVentas() {
  const [puedeRegistrarCotizacion, setPuedeRegistrarCotizacion] = useState(false);
  const [puedeVerCotizaciones, setPuedeVerCotizaciones] = useState(false);
  const [puedeVerVentasAgendadas, setPuedeVerVentasAgendadas] = useState(false);
  const [puedeVerPedidosDespachados, setPuedeVerPedidosDespachados] = useState(false);
  const [puedeVerPedidosEntregados, setPuedeVerPedidosEntregados] = useState(false);
  const [puedeVerPedidosCancelados, setPuedeVerPedidosCancelados] = useState(false);
  const [puedeVerPedidosDevueltos, setPuedeVerPedidosDevueltos] = useState(false);
  const [puedeVerListaDeVentas, setPuedeVerListaDeVentas] = useState(false);
  const [puedeVerListaDeClientes, setPuedeVerListaDeClientes] = useState(false);
  const [puedeVerProspectos, setPuedeVerProspectos] = useState(false);
  const [puedeVerReportesVentas, setPuedeVerReportesVentas] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeRegistrarCotizacion(usuario.permissions.includes('cotizaciones.crear'));
      setPuedeVerCotizaciones(usuario.permissions.includes('cotizaciones.ver'));
      setPuedeVerVentasAgendadas(usuario.permissions.includes('pedidosAgendados.ver'));
      setPuedeVerPedidosDespachados(usuario.permissions.includes('pedidosDespachados.ver'));
      setPuedeVerPedidosEntregados(usuario.permissions.includes('pedidosEntregados.ver'));
      setPuedeVerPedidosCancelados(usuario.permissions.includes('pedidosCancelados.ver'));
      setPuedeVerPedidosDevueltos(usuario.permissions.includes('pedidosDevueltos.ver'));
      setPuedeVerListaDeVentas(usuario.permissions.includes('listaDeVentas.ver'));
      setPuedeVerListaDeClientes(usuario.permissions.includes('clientes.ver'));
      setPuedeVerProspectos(usuario.permissions.includes('prospectos.ver'));
      setPuedeVerReportesVentas(usuario.permissions.includes('reportesVentas.ver'));
    }
  }, []);
  return (
    <div className="contenedor-modulo">
      {(puedeRegistrarCotizacion || puedeVerCotizaciones || puedeVerListaDeClientes || puedeVerListaDeVentas || puedeVerPedidosCancelados || puedeVerPedidosDespachados || puedeVerPedidosDevueltos || puedeVerPedidosEntregados || puedeVerProspectos || puedeVerReportesVentas || puedeVerVentasAgendadas) && (
        <section className="seccion">
          <fieldset>
            <legend>Ventas</legend>
            <div className="botones-container">

              {/* Separador Cotizaciones */}
              {puedeRegistrarCotizacion && (
                <Link to="/RegistrarCotizacion">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/14185/14185243.png" alt="Registrar cotización" className="icono" />
                    <span>Registrar cotización</span>
                  </button>
                </Link>
              )}


              {puedeVerCotizaciones && (
                <Link to="/ListaDeCotizaciones">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/2666/2666436.png" alt="Lista de cotizaciones" className="icono" />
                    <span>Lista de cotizaciones</span>
                  </button>
                </Link>
              )}

              {puedeVerVentasAgendadas && (
                <Link to="/PedidosAgendados">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/12155/12155326.png" alt="Pedidos agendados" className="icono" />
                    <span>Pedidos por despachar</span>
                  </button>
                </Link>
              )}

              {puedeVerPedidosDespachados && (
                <Link to="/PedidosDespachados">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/12155/12155326.png" alt="Pedidos agendados" className="icono" />
                    <span>Pedidos despachados</span>
                  </button>
                </Link>
              )}

              {puedeVerPedidosEntregados && (
                <Link to="/PedidosEntregados">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/2711/2711224.png" alt="Pedidos entregados" className="icono" />
                    <span>Pedidos entregados</span>
                  </button>
                </Link>
              )}

              {puedeVerPedidosCancelados && (
                <Link to="/PedidosCancelados">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/1136/1136923.png" alt="Pedidos cancelados" className="icono" />
                    <span>Pedidos cancelados</span>
                  </button>
                </Link>
              )}

              {puedeVerPedidosDevueltos && (
                <Link to="/PedidosDevueltos">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/14185/14185243.png" alt="Registrar cotización" className="icono" />
                    <span>Pedidos devueltos</span>
                  </button>
                </Link>
              )}

              {puedeVerListaDeVentas && (
                <Link to="/Ventas">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/2666/2666436.png" alt="Lista de cotizaciones" className="icono" />
                    <span>Lista de ventas</span>
                  </button>
                </Link>
              )}

              {puedeVerListaDeClientes && (
                <Link to="/ListaDeClientes">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/3239/3239045.png" alt="Lista de clientes" className="icono" />
                    <span>Lista de clientes</span>
                  </button>
                </Link>
              )}

              {puedeVerProspectos && (
                <Link to="/ProspectosDeClientes">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/901/901407.png" alt="Prospectos de cliente" className="icono" />
                    <span>Prospectos de cliente</span>
                  </button>
                </Link>
              )}

              {puedeVerReportesVentas && (
                <Link to="/ReporteVentas">
                  <button className="boton">
                    <img src="https://cdn-icons-png.freepik.com/256/901/901407.png" alt="Prospectos de cliente" className="icono" />
                    <span>Reportes</span>
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
