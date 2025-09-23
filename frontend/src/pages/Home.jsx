import React, { useEffect, useState } from 'react'
import '../App.css'
import Fijo from '../components/Fijo'
import ContenedorModuloUsuarios from '../components/ContenedorModuloUsuarios'
import ContenedorModuloCompras from '../components/ContenedorModuloCompras'
import ContenedorModuloVentas from '../components/ContenedorModuloVentas'
import ContenedorModuloProductos from '../components/ContenedorModuloProductos'


export default function Home() {
  const [puedeVerRoles, setPuedeVerRoles] = useState(false);
  const [puedeVerUsuarios, setPuedeVerUsuarios] = useState(false);
  const [puedeVerProveedores, setPuedeVerProveedores] = useState(false);
  const [puedeVerHCompras, setPuedeVerHCompras] = useState(false);
  const [puedeVerCategorias, setPuedeVerCategorias] = useState(false);
  const [puedeVerSubcategorias, setPuedeVerSubcategorias] = useState(false);
  const [puedeVerProductos, setPuedeVerProductos] = useState(false);
  const [puedeVerReportesProductos, setPuedeVerReportesProductos] = useState(false);
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
  const [puedeVerOrdenes, setPuedeVerOrdenes] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeVerRoles(usuario.permissions.includes('roles.ver'));
      setPuedeVerUsuarios(usuario.permissions.includes('usuarios.ver'));
      setPuedeVerProveedores(usuario.permissions.includes('proveedores.ver'));
      setPuedeVerHCompras(usuario.permissions.includes('hcompras.ver'));
      setPuedeVerCategorias(usuario.permissions.includes('categorias.ver'));
      setPuedeVerSubcategorias(usuario.permissions.includes('subcategorias.ver'));
      setPuedeVerProductos(usuario.permissions.includes('productos.ver'));
      setPuedeVerReportesProductos(usuario.permissions.includes('reportesProductos.ver'));
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
      setPuedeVerOrdenes(usuario.permissions.includes('ordenesCompra.ver'));
    }
  }, []);
  return (
    <div>
      <Fijo />
      <div class="content">
        <div className="contenido-modulo">
          {(puedeVerRoles || puedeVerUsuarios) && (
            <ContenedorModuloUsuarios />
          )}
          <br />
          {(puedeVerOrdenes || puedeVerProveedores || puedeVerHCompras) && (
            <ContenedorModuloCompras />
          )}
          <br />
          {(puedeVerCategorias || puedeVerSubcategorias || puedeVerProductos || puedeVerReportesProductos) && (
            <ContenedorModuloProductos />
          )}
          <br />
          {(puedeRegistrarCotizacion || puedeVerCotizaciones || puedeVerListaDeClientes || puedeVerListaDeVentas || puedeVerPedidosCancelados || puedeVerPedidosDespachados || puedeVerPedidosDevueltos || puedeVerPedidosEntregados || puedeVerProspectos || puedeVerReportesVentas || puedeVerVentasAgendadas) && (
            <ContenedorModuloVentas />
          )}
        </div>
        
      </div>
        <div className="custom-footer">
          <p className="custom-footer-text">
            © 2025 <span className="custom-highlight">PANGEA</span>. Todos los derechos reservados.
          </p>
        </div>
    </div>

  )
}
