import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavUsuarios() {
  const [puedeVerUsuarios, setPuedeVerUsuarios] = useState(false);
  const [puedeVerRoles, setPuedeVerRoles] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      if (usuario.permissions) {
        setPuedeVerUsuarios(usuario.permissions.includes('usuarios.ver'));
        setPuedeVerRoles(usuario.permissions.includes('roles.ver'));
      }
    }
  }, []);

  return (
    <div>
      <h2>Proveedores y Compras</h2>
      <div className="nav-modulo-wrapper">
        <nav className="nav-modulo" id="usuarios-nav">
          {puedeVerUsuarios && (
            <Link
              to="/Proveedores"
              className={
                location.pathname === '/Proveedores' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Proveedores
            </Link>
          )}

          {puedeVerRoles && (
            <Link
              to="/HistorialCompras"
              className={
                location.pathname === '/HistorialCompras' ? 'nav-item active' : 'nav-item'
              }
            >
                Historial de Compras
            </Link>
          )}
          {puedeVerRoles && (
            <Link
              to="/ReporteProveedores"
              className={
                location.pathname === '/ReporteProveedores' ? 'nav-item active' : 'nav-item'
              }
            >
                Reportes de Compras
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
