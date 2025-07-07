import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavUsuarios() {
  const [puedeVerCategorias, setPuedeVerCategorias] = useState(false);
  const [puedeVerSubcategorias, setPuedeVerSubcategorias] = useState(false);
  const [puedeVerProductos, setPuedeVerProductos] = useState(false);
  const [puedeVerReportesProductos, setPuedeVerReportesProductos] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      if (usuario.permissions) {
        setPuedeVerCategorias(usuario.permissions.includes('categorias.ver'));
        setPuedeVerSubcategorias(usuario.permissions.includes('subcategorias.ver'));
        setPuedeVerProductos(usuario.permissions.includes('productos.ver'));
        setPuedeVerReportesProductos(usuario.permissions.includes('reportesProductos.ver'));
      }
    }
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <div className="nav-modulo-wrapper">
        <nav className="nav-modulo" id="usuarios-nav">
          {puedeVerCategorias && (
            <Link
              to="/Categorias"
              className={
                location.pathname === '/Categorias' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Categorias
            </Link>
          )}

          {puedeVerSubcategorias && (
            <Link
              to="/Subcategorias"
              className={
                location.pathname === '/Subcategorias' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Subcategorias
            </Link>
          )}

          {puedeVerProductos && (
            <Link
              to="/GestionProductos"
              className={
                location.pathname === '/GestionProductos' ? 'nav-item active' : 'nav-item'
              }
            >
              Lista de Productos
            </Link>
          )}
          {puedeVerReportesProductos && (
            <Link
              to="/ReporteProductos"
              className={
                location.pathname === '/ReporteProductos' ? 'nav-item active' : 'nav-item'
              }
            >
              Reportes de Productos
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
