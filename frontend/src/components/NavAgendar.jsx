import React from 'react'
import { Link } from 'react-router-dom'

/*Este componente es del navegable de agendar pedido */
export default function NavUsuarios() {
  return (
    <div>
      <nav className='nav-modulo' id='usuarios-nav'>
        <Link as={Link} to="/Persona"><li>Persona</li></Link>
        <Link as={Link} to="/Empresa"><li>Empresa</li></Link>
      </nav>
    </div>
  )
}
