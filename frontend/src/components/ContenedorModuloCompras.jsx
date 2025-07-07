import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContenedorModuloCompras() {
  const [puedeVerProveedores, setPuedeVerProveedores] = useState(false);
  const [puedeVerHCompras, setPuedeVerHCompras] = useState(false);
  const [puedeVerReportesCompras, setPuedeVerReportesCompras] = useState(false);


  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario && usuario.permissions) {
      setPuedeVerProveedores(usuario.permissions.includes('proveedores.ver'));
      setPuedeVerHCompras(usuario.permissions.includes('hcompras.ver'));
      setPuedeVerReportesCompras(usuario.permissions.includes('reportesCompras.ver'));
    }
  }, []);
  return (
    <div className="contenedor-modulo">
      {(puedeVerHCompras || puedeVerProveedores) && (
        <section className="seccion">
          <fieldset>
            <legend>Compras</legend>
            <div className="botones-container">
              {puedeVerHCompras && (
                <Link as={Link} to="/HistorialCompras">
                  <button className="boton">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2921/2921222.png"
                      alt="Historial de compras"
                      className="icono"
                    />
                    <span>Historial de compras</span>
                  </button>
                </Link>
              )}

              {puedeVerProveedores && (
                <Link as={Link} to="/Proveedores">
                  <button className="boton">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/942/942751.png"
                      alt="Proveedores"
                      className="icono"
                    />
                    <span>Catalogo de proveedores</span>
                  </button>
                </Link>
              )}
              {puedeVerReportesCompras && (
                <Link as={Link} to="/ReporteProveedores">
                  <button className="boton">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/942/942751.png"
                      alt="Proveedores"
                      className="icono"
                    />
                    <span>Reportes de compras</span>
                  </button>
                </Link>
              )}

            </div>
          </fieldset>
        </section>
      )}
    </div>
  );
}
