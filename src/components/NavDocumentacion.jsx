import React from 'react'
import { Link } from 'react-router-dom'

/*Este componente es el titulo del modulo Usuarios y el navegable del mismo*/
export default function NavUsuarios() {
  return (
    <div>
      <h2 >SIG</h2>

      <nav className='nav-modulo' id='usuarios-nav'>
        <Link as={Link} to="/Documentacion"><li>Documentacion</li></Link>
        <Link as={Link} to="/InformacionDeFuente"><li>Informacion De Fuente</li></Link>
      </nav>

    </div>
  )
}