import React from 'react'
import { Link } from 'react-router-dom'

/*Este componente es el titulo del modulo Usuarios y el navegable del mismo*/
export default function NavReportes() {
  return (
    <div>
      <h2 >Reportes</h2>
      <nav className='nav-modulo' id='usuarios-nav'>
        <Link as={Link} to="/ListaDeUsuarios"><li className='item-truncado'>Lista de usuarios</li></Link>
        <Link as={Link} to="/AñadirUsuario"><li className='item-truncado'>Añadir usuarios</li></Link>
        <Link as={Link} to="/AñadirRol"><li className='item-truncado'>Añadir Rol</li></Link>
      </nav>
    </div>
  )
}