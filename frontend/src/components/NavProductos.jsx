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
      <h2>Productos</h2>
      <div className="nav-modulo-wrapper">
        <nav className="nav-modulo" id="usuarios-nav">
          {puedeVerUsuarios && (
            <Link
              to="/Categorias"
              className={
                location.pathname === '/Categorias' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Categorias
            </Link>
          )}

          {puedeVerRoles && (
            <Link
              to="/Subcategorias"
              className={
                location.pathname === '/Subcategorias' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Subcategorias
            </Link>
          )}

          {puedeVerRoles && (
            <Link
              to="/GestionProductos"
              className={
                location.pathname === '/GestionProductos' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Productos
            </Link>
          )}
          {puedeVerRoles && (
            <Link
              to="/ReporteProductos"
              className={
                location.pathname === '/ReporteProductos' ? 'nav-item active' : 'nav-item'
              }
            >
              Reporte de Productos
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
