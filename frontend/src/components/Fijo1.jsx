import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { mostrarMenu } from '../funciones/animaciones.js'
import { toggleSubMenu } from '../funciones/animaciones.js'
import { cerrarMenu } from '../funciones/animaciones.js'
import Swal from 'sweetalert2'


const permisosPorUsuario = {
  usuario1: ['SIG'], // verá solo el módulo "SIG"
  
};


export default function Fijo() {

  

  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuario') || '';
  const permisos = permisosPorUsuario[usuario] || [];

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
      // Aquí podrías limpiar el estado o el token, si lo usas
      // Por ejemplo: localStorage.clear();

      await Swal.fire({
        title: '¡Sesión cerrada!',
        text: 'Has salido correctamente.',
        icon: 'success'
      });

      navigate('/Login');
    }
  };
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
            <Link as={Link} to="/Home1"><span id='empresa-nombre'>JLA Global Company </span></Link>
          </div>
          <div className="user">
            <Link as={Link} to="/Perfil1"><span style={{color:'white'}}>Pepito</span></Link>
            <Link as={Link} to="/Perfil1"><img src="https://cdn-icons-png.freepik.com/256/17740/17740782.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className='icono'/></Link>  
          </div> 
        </header>

        <span id='close-menu' className="close-menu" onClick={cerrarMenu}>x</span>
        <div id='menu' className="menu">
          <div className="usuarioYModulos">

            <Link as={Link} to="/Perfil1"><div className="preview-usuario">
              <img src="https://cdn-icons-png.freepik.com/256/17740/17740782.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" style={{ width: "80px" }} />
              <div className="datos-usuario">
                <span className="usuario-nombre">Pepito Perez</span>
                <br />
                <span className="usuario-rol">SIG</span>
              </div>
            </div></Link>

            <div className="modulos-menu">

              {(permisos.includes('SIG') || permisos.includes('admin')) && (
                <nav>
                  <li style={{ padding: "10px 0" }} onClick={() => toggleSubMenu('submenuSIG')}>SIG</li>
                  <ul id="submenuSIG" className="dropdown">
                    <Link as={Link} to="/Documentacion"><li>Documentacion</li></Link>
                    <Link as={Link} to="/InformacionDeFuente"><li>Informacion de fuente</li></Link>
                  </ul>
                </nav>
              )}
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
