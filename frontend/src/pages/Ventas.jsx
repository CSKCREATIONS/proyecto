import React, { useState, useEffect } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/api/ventas', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Ventas recibidas:', data); // <-- Agrega esto
      setVentas(data);
    })
    .catch(err => console.error('Error al cargar ventas:', err));
}, []);


  const ventasFiltradas = ventas.filter(venta => {
    const coincideFecha = !filtroFecha || new Date(venta.fecha).toISOString().slice(0, 10) === filtroFecha;
    const coincideCliente = !filtroCliente || venta.cliente?.nombre?.toLowerCase().includes(filtroCliente.toLowerCase());
    const coincideEstado = !filtroEstado || venta.estado === filtroEstado;

    return coincideFecha && coincideCliente && coincideEstado;
  });

  const cargarVentas = () => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/api/ventas', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setVentas(data))
    .catch(err => console.error('Error al cargar ventas:', err));
};

useEffect(() => {
  cargarVentas();
}, []);


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Lista de ventas"
            buscar="Buscar venta"
          />

          <div className="filtros-tabla">
            <div className="filtro-grupo">
              <label>Fecha:</label>
              <input
                type="date"
                className="filtro-input"
                value={filtroFecha}
                onChange={e => setFiltroFecha(e.target.value)}
              />
            </div>
            <div className="filtro-grupo">
              <label>Cliente:</label>
              <input
                type="text"
                className="filtro-input"
                placeholder="Buscar cliente..."
                value={filtroCliente}
                onChange={e => setFiltroCliente(e.target.value)}
              />
            </div>
            <div className="filtro-grupo">
              <label>Estado:</label>
              <select
                className="filtro-select"
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            
          </div>
            


          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th># Venta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                        No se encontraron ventas con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    ventasFiltradas.map((venta, index) => (
                      <tr key={venta._id}>
                        <td>V-{venta._id.slice(-5)}</td>
                        <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                        <td>{venta.cliente?.nombre || 'N/A'}</td>
                        <td>${venta.total?.toFixed(2) || 0}</td>
                        <td>{venta.estado}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
