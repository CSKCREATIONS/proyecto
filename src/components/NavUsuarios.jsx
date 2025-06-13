import React from 'react'
import { NavLink } from 'react-router-dom'


/*Este componente es el titulo del modulo Usuarios y el navegable del mismo*/
export default function NavUsuarios() {
  return (
    <div>
      <h2 >Usuarios</h2>
      <nav className='nav-modulo' id='usuarios-nav'>
        <NavLink to="/ListaDeUsuarios" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Lista de usuarios
        </NavLink>
        <NavLink to="/AñadirUsuario" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Añadir usuario
        </NavLink>
        <NavLink to="/AñadirRol" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Añadir Rol
        </NavLink>
      </nav>
    </div>
  )
}
