import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NavCompras() {
  const containerRef = useRef(null);
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [overflowLinks, setOverflowLinks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const links = [
    { path: "/HistorialCompras", label: "Historial de compras" },
    { path: "/CatalogoProveedores", label: "Catálogo de proveedores" },
    { path: "/ReporteCompras", label: "Dashboard" },
  ];

  useEffect(() => {
    const updateLayout = () => {
      const container = containerRef.current;
      if (!container) return;

      const availableWidth = container.offsetWidth;
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.height = 0;
      tempContainer.style.display = 'flex';
      tempContainer.style.gap = '0.5rem';

      document.body.appendChild(tempContainer);

      let usedWidth = 0;
      const visible = [];
      const hidden = [];

      links.forEach((link) => {
        const linkElement = document.createElement('div');
        linkElement.className = 'nav-item';
        linkElement.textContent = link.label;
        tempContainer.appendChild(linkElement);

        const width = linkElement.offsetWidth;
        usedWidth += width + 12;

        if (usedWidth < availableWidth - 50) {
          visible.push(link);
        } else {
          hidden.push(link);
        }
      });

      document.body.removeChild(tempContainer);
      setVisibleLinks(visible);
      setOverflowLinks(hidden);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [showDropdown]);

  return (
    <div>
      <h2>Compras</h2>
      <div className="nav-modulo-wrapper">
        <nav className="nav-modulo" ref={containerRef}>
          {visibleLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {overflowLinks.length > 0 && (
          <div className="nav-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)} className="nav-dropdown-toggle">⋯</button>
            {showDropdown && (
              <div className="nav-dropdown-menu">
                {overflowLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => isActive ? 'dropdown-item active' : 'dropdown-item'}
                    onClick={() => setShowDropdown(false)}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
