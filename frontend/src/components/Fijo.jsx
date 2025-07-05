import React, { useEffect, useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { mostrarMenu, toggleSubMenu, cerrarMenu } from '../funciones/animaciones.js';
import Swal from 'sweetalert2';


export default function Fijo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [puedeVerRoles, setPuedeVerRoles] = useState(false);
  const [puedeVerUsuarios, setPuedeVerUsuarios] = useState(false);

  useEffect(() => {
    // 1. Cargar datos del usuario y permisos
    const loadUserAndPermissions = async () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const usuario = JSON.parse(storedUser);

    // Si solo se guarda el ID del rol, cargar el rol desde la API
    if (usuario.role && typeof usuario.role === 'string') {
      try {
        const res = await fetch(`/api/roles/${usuario.role}`);
        const data = await res.json();
        if (data.success) {
          usuario.role = data.role;
          localStorage.setItem('user', JSON.stringify(usuario));
        }
      } catch (error) {
        console.error("Error al cargar rol:", error);
      }
    }

    setUser(usuario);

    const permissions = usuario.permissions || [];
    setPuedeVerUsuarios(permissions.includes('usuarios.ver'));
    setPuedeVerRoles(permissions.includes('roles.ver'));
  }
};


    // Cargar datos iniciales
    loadUserAndPermissions();

    // 2. Configurar evento para cambios en localStorage
    const handleStorageChange = () => {
      loadUserAndPermissions();
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Manejar click fuera del menú (código original preservado)
    const handleClickOutside = (event) => {
      const menu = document.getElementById('menu');
      const closeBtn = document.getElementById('close-menu');
      const btnMenu = document.getElementById('btn-menu');

      if (menu.classList.contains('mostrar-menu') &&
        !menu.contains(event.target) &&
        !btnMenu.contains(event.target)) {
        cerrarMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClick = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      //remueve el token
      localStorage.removeItem('token');
      //quita el logueo del usuario
      localStorage.removeItem('user');

      //redirige al login
      navigate('/Login');
    }
  };
  return (
    <div>
      <div className="fijo">
        <header>
          <div className="izquierda">
            <button onClick={(e) => {
              e.stopPropagation(); // evita propagación
              mostrarMenu();
            }} id="btn-menu">

              <div class="palito"></div>
              <div class="palito"></div>
              <div class="palito"></div>
            </button>
            <Link as={Link} to='/Home'>
              <span
                id='empresa-nombre'
                style={{ cursor: 'pointer', color: 'white' }}
              >
                JLA Global Company
              </span>
            </Link>

          </div>
          <div className="user">
            {user && (
              <Link as={Link} to="/Perfil">
                <span style={{ color: 'white' }}>{user.firstName}</span>
              </Link>
            )}

            <Link as={Link} to="/Perfil"><img style={{ color: 'white' }} src="https://cdn-icons-png.freepik.com/256/17740/17740782.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className='icono' /></Link>
          </div>
        </header>

        <span id='close-menu' className="close-menu" onClick={cerrarMenu}>x</span>
        <div id='menu' className="menu">
          <div className="usuarioYModulos">

            <Link as={Link} to="/Perfil"><div className="preview-usuario">
              <img src="https://cdn-icons-png.freepik.com/256/17740/17740782.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" style={{ width: "80px" }} />
              <div className="datos-usuario">
                {user && (
                  <span className="usuario-nombre">{user.firstName} {user.surname}</span>
                )}

                <br />
                {user && (
                  <span className="usuario-rol">
                    {typeof user.role === 'object' ? user.role.name : user.role}
                  </span>
                )}

              </div>
            </div></Link>

            <div className="modulos-menu">
              {(puedeVerUsuarios || puedeVerRoles) && (
                <nav>
                  <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuUsuarios')}>
                    Usuarios
                  </li>
                  <ul className="dropdown" id="submenuUsuarios">
                    {puedeVerUsuarios && (
                      <Link to="/ListaDeUsuarios"><li>Lista de Usuarios</li></Link>
                    )}
                    {puedeVerRoles && (
                      <Link to="/RolesYPermisos"><li>Roles y permisos</li></Link>
                    )}
                  </ul>
                </nav>
              )}


              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('Compras')}>Compras</li>
                <ul id="Compras" className="dropdown">
                  <Link as={Link} to="/Documentacion"><li>Historial de compras </li></Link>
                  <Link as={Link} to="/InformacionDeFuente"><li>Catalogo de proveedores</li></Link>
                </ul>
              </nav>

              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuproductos')}>Productos</li>
                <ul id="submenuproductos" className="dropdown">
                  <Link as={Link} to="/GestionProductos"><li>Gestion productos</li></Link>
                  <Link as={Link} to="/Documentacion"><li>Documentacion</li></Link>
                  <Link as={Link} to="/InformacionDeFuente"><li>Informacion de fuente</li></Link>
                </ul>
              </nav>

              <nav>
                <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuVentas')}>Ventas</li>
                <ul id="submenuVentas" className="dropdown">
                  <Link as={Link} to="/RegistrarCotizacion"><li>Registrar cotizacion</li></Link>
                  <Link as={Link} to="/ListaDeCotizaciones"><li>Lista de cotizaciones</li></Link>
                  <Link as={Link} to="/AgendarVenta"><li>Agendar venta</li></Link>
                  <Link as={Link} to="/PedidosAgendados"><li>Pedidos agendados</li></Link>
                  <Link as={Link} to="/PedidosEntregados"><li>Pedidos entregados</li></Link>
                  <Link as={Link} to="/PedidosCancelados"><li>Pedidos cancelados</li></Link>
                  <Link as={Link} to="/ListaDeClientes"><li>Lista de clientes</li></Link>
                  <Link as={Link} to="/ProspectosDeClientes"><li>Prospectos de cliente</li></Link>
                  <Link as={Link} to="/ReporteVentas"><li>Dashboard</li></Link>
                </ul>
              </nav>
            </div>
          </div>

          <button className="logout-btn" onClick={handleClick}>
            Cerrar sesión
          </button>


        </div>

      </div>
    </div>
  )
}
