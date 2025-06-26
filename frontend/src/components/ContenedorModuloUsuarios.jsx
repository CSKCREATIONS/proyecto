import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

export default function ContenedorModuloUsuarios() {
  const [puedeVerRoles, setPuedeVerRoles] = useState(false);
  const [puedeVerUsuarios, setPuedeVerUsuarios] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeVerRoles(usuario.permissions.includes('roles.ver'));
      setPuedeVerUsuarios(usuario.permissions.includes('usuarios.ver'));
    }
  }, []);
  return (
     <section className="seccion">
    {(puedeVerRoles || puedeVerUsuarios) && (
     
      <fieldset>
        <legend>Usuarios</legend>
        <div className="botones-container">
          {puedeVerUsuarios && (
            <Link as={Link} to="/ListaDeUsuarios" >
              <button className="boton">
                <img src="https://cdn-icons-png.freepik.com/256/7169/7169774.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
                <span>Lista de usuarios</span>
              </button>
            </Link>
          )}
            
          {puedeVerRoles && (
            <Link as={Link} to="/RolesYPermisos" >
            <button className="boton">
              <img src="https://cdn-icons-png.freepik.com/256/5507/5507771.png?ga=GA1.1.755740385.1744083497&semt=ais_hybrid" alt="" className="icono" />
              <span>Roles y permisos</span>
            </button>
          </Link>
          )}
        </div>
      </fieldset>
    
    )}
    </section>
  )
}
