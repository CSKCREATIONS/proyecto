import React from 'react'
import { NavLink } from 'react-router-dom'


/*Este componente es el titulo del modulo ventas y el navegable del mismo
el cual es llamado en cada una de las paginas del modulo ventas, a excepcion de agendar venta y registrar cotizacion*/
export default function NavVentas(props) {
  return (
    
      <div>
        <h2>Ventas</h2>
        <nav className='nav-modulo' id='ventas-nav'>
          <NavLink to="/RegistrarCotizacion" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Registrar cotización
          </NavLink>
          <NavLink to="/ListaDeCotizaciones" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Lista de cotizaciones
          </NavLink>
          <NavLink to="/AgendarVenta" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Agendar venta
          </NavLink>
          <NavLink to="/PedidosAgendados" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Pedidos agendados
          </NavLink>
          <NavLink to="/PedidosEntregados" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Pedidos entregados
          </NavLink>
          <NavLink to="/Devoluciones" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Devoluciones
          </NavLink>
          <NavLink to="/PedidosCancelados" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Pedidos cancelados
          </NavLink>
          <NavLink to="/ListaDeClientes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Lista de clientes
          </NavLink>
          <NavLink to="/ProspectosDeClientes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Prospectos de clientes
          </NavLink>
        </nav>
      </div>
      )
}
