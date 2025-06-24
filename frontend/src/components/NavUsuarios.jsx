import React from 'react'
import { NavLink } from 'react-router-dom'


/*Este componente es el titulo del modulo Usuarios y el navegable del mismo*/
export default function NavUsuarios() {
  return (
    <div>
      <h2 >Usuarios</h2>
      <div className="nav-modulo-wrapper">
        <nav className='nav-modulo' id='usuarios-nav'>
        <NavLink to="/ListaDeUsuarios" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Lista de usuarios
        </NavLink>
        <NavLink to="/RolesYPermisos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Roles y permisos
        </NavLink>
      </nav>
      </div>
      
    </div>
  )
}
