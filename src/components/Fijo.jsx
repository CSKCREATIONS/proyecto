import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { mostrarMenu } from '../funciones/animaciones.js'
import { toggleSubMenu } from '../funciones/animaciones.js'
import { cerrarMenu } from '../funciones/animaciones.js'

export default function Fijo() {
  return (
    <div>
      <div className="fijo">
        <header>
          <div className="izquierda">
            <button onClick={mostrarMenu} id="btn-menu">
              <div class="palito"></div>
              <div class="palito"></div>
              <div class="palito"></div>
            </button>
            <Link as={Link} to="/Home"><span id='empresa-nombre'>JLA Global Company </span></Link>
          </div>
          <div className="user">
            <span>Pepito</span>
            <img src="../images/gatico.jpg" alt="logo usuario" />
          </div>
        </header>

        <span id='close-menu' className="close-menu" onClick={cerrarMenu}>x</span>
        <div id='menu' className="menu">
          <div className="usuarioYModulos">

            <div className="preview-usuario">
              <img src="../images/gatico.jpg" alt="" style={{ width: "80px" }} />
              <div className="datos-usuario">
                <span className="usuario-nombre">Pepito Perez</span>
                <span className="usuario-rol">Administrador</span>
              </div>
            </div>

            <div className="modulos-menu">
              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuUsuarios')}>
                  Usuarios
                </li>

                <ul className="dropdown" id="submenuUsuarios">
                  <Link as={Link} to="/ListaDeUsuarios"><li>Lista de Usuarios</li></Link>
                  <Link as={Link} to="/AñadirUsuario">
                    <li>Añadir usuario</li></Link>
                  <Link as={Link} to="/AñadirRol">
                    <li>Añadir rol</li></Link>
                </ul>

              </nav>

              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuSIG')}>SIG</li>
                <ul id="submenuSIG" className="dropdown">
                  <Link as={Link} to="/InformacionDeFuente"><li>Informacion de fuente</li></Link>
                  <Link as={Link} to="/Documentacion"><li>Documentacion</li></Link>
                </ul>
              </nav>

              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuVentas')}>Ventas </li>
                <ul id="submenuVentas" className="dropdown">
                  <Link as={Link} to="/AgendarVenta"><li>Agendar venta</li></Link>
                  <Link as={Link} to="/PedidosAgendados"><li>Pedidos agendados</li></Link>
                  <Link as={Link} to="/PedidosEntregados"><li>Pedidos entregados</li></Link>
                  <Link as={Link} to="/Devoluciones"><li>Devoluciones</li></Link>
                  <Link as={Link} to="/PedidosCancelados"><li>Pedidos cancelados</li></Link>
                  <Link as={Link} to="/RegistrarCotizacion"><li>Registrar cotizacion</li></Link>
                  <Link as={Link} to="/ListaDeCotizaciones"><li>Lista de cotizaciones</li></Link>
                  <Link as={Link} to="/ListaDeClientes"><li>Lista de clientes</li></Link>
                  <Link as={Link} to="/ProspectosDeClientes"><li>Prospectos de cliente</li></Link>
                </ul>
              </nav>
            </div>
          </div>
          <div className="logout">
            <img src=" ../images/gatico.jpg" alt="Cerrar sesion" style={{ width: "70px" }} />
          </div>

        </div>

      </div>
    </div>
  )
}
