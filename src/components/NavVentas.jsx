import React from 'react'
import { Link } from 'react-router-dom'


/*Este componente es el titulo del modulo ventas y el navegable del mismo
el cual es llamado en cada una de las paginas del modulo ventas, a excepcion de agendar venta y registrar cotizacion*/
export default function NavVentas(props) {
    return (
        <div>
            <h2>Ventas</h2>
                    <nav className='nav-modulo' id='ventas-nav'>
                        <Link as={Link} to="/AgendarVenta">
                            <li>Agendar venta</li></Link>
                        <Link as={Link} to="/PedidosAgendados">
                            <li>Pedidos agendados</li></Link>
                        <Link as={Link} to="/PedidosEntregados">
                            <li>Pedidos entregados</li></Link>
                        <Link as={Link} to="/Devoluciones">
                            <li>Devoluciones</li></Link>
                        <Link as={Link} to="/PedidosCancelados">
                            <li>Pedidos cancelados</li></Link>
                        <Link as={Link} to="/RegistrarCotizacion">
                            <li>Registrar cotizacion</li></Link>
                        <Link as={Link} to="/ListaDeCotizaciones">
                            <li>Lista de cotizaciones</li></Link>
                        <Link as={Link} to="/ListaDeClientes">
                            <li>Lista de clientes</li></Link>
                        <Link as={Link} to="/ProspectosDeClientes">
                            <li>Prospectos de cliente</li></Link>
                    </nav>
        </div>
    )
}
