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
                            <li className='item-truncado'>Agendar venta</li></Link>
                        <Link as={Link} to="/PedidosAgendados">
                            <li className='item-truncado'>Pedidos agendados</li></Link>
                        <Link as={Link} to="/PedidosEntregados">
                            <li className='item-truncado'>Pedidos entregados</li></Link>
                        <Link as={Link} to="/Devoluciones">
                            <li className='item-truncado'>Devoluciones</li></Link>
                        <Link as={Link} to="/PedidosCancelados">
                            <li className='item-truncado'>Pedidos cancelados</li></Link>
                        <Link as={Link} to="/RegistrarCotizacion">
                            <li className='item-truncado'>Registrar cotizacion</li></Link>
                        <Link as={Link} to="/ListaDeCotizaciones">
                            <li className='item-truncado'>Lista de cotizaciones</li></Link>
                        <Link as={Link} to="/ListaDeClientes">
                            <li className='item-truncado'>Lista de clientes</li></Link>
                        <Link as={Link} to="/ProspectosDeClientes">
                            <li className='item-truncado'>Prospectos de clientes</li></Link>
                    </nav>
        </div>
    )
}
