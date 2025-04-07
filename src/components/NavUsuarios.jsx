import React from 'react'
import { Link } from 'react-router-dom'

/*Este componente es el titulo del modulo Usuarios y el navegable del mismo*/
export default function NavUsuarios() {
  return (
    <div>
      <h2 >Usuarios</h2>
      <nav className='nav-modulo' id='usuarios-nav'>
        <Link as={Link} to="/ListaDeUsuarios"><li>Lista de usuarios</li></Link>
        <Link as={Link} to="/AñadirUsuario"><li>Añadir usuario</li></Link>
        <Link as={Link} to="/AñadirRol"><li>Añadir Rol</li></Link>
      </nav>
    </div>
  )
}
