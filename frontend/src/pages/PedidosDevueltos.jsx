import React, { useEffect, useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';

export default function PedidosDevueltos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const mostrarProductos = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const devueltos = data.filter(p => p.estado === 'devuelto');
        setPedidos(devueltos);
      })
      .catch(err => console.error('Error al cargar pedidos devueltos:', err));
  }, []);

  const ModalProductosCotizacion = ({ visible, onClose, productos, cotizacionId }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-compact modal-lg">
        <div className="modal-header">
          <h5 className="modal-title">Productos del Pedido #{cotizacionId?.slice(-5)}</h5>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {productos && productos.length > 0 ? (
            <ul className="list-group">
              {productos.map((prod, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>{prod?.product?.name  || 'Producto desconocido'}</strong><br />
                  Cantidad: {prod?.cantidad}<br />
                  Precio unitario: ${prod?.precioUnitario?.toFixed(2) || 0}<br />
                  <em>Total: ${(prod?.cantidad * prod?.precioUnitario).toFixed(2)}</em>
                </li> 
              ))}
            </ul>
          ) : (
            <p>No hay productos asociados a este pedido.</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Pedidos Devueltos"
            exportarPDF={null}
            exportToExcel={null}
            buscar='Buscar pedido devuelto'
          />
          <div className="container-tabla">
            <div className="table-container">
              <table id="tabla_pedidos_devueltos">
                <thead><br />
                  <tr>
                    <th>No</th>
                    <th>identificador de Pedido</th> {/* 👈 NUEVA COLUMNA */}
                    <th>Producto</th>
                    <th>F. Agendamiento</th>
                    <th>F. Entrega</th>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Observaciones</th>
                    <th>Motivo Devolucion</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, index) => (
                    <tr key={pedido._id}>
                      <td>{index + 1}</td>
                      <td>{pedido.numeroPedido || '---'}</td> {/* 👈 Muestra el número PED-xxxxx */}
                      <td>
                        <button className="btn btn-info" onClick={() => mostrarProductos(pedido)}>
                          Productos
                        </button>
                      </td>
                      <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                      <td>{pedido.cliente?.nombre}</td>
                      <td>{pedido.cliente?.ciudad}</td>
                      <td>{pedido.cliente?.telefono}</td>
                      <td>{pedido.cliente?.correo}</td>
                      <td>{pedido.observacion || 'N/A'}</td>
                        <td>{pedido.estado === 'devuelto' ? pedido.motivoDevolucion : ''}</td>
                      <td>{pedido.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ModalProductosCotizacion
        visible={!!pedidoSeleccionado}
        onClose={() => setPedidoSeleccionado(null)}
        productos={pedidoSeleccionado?.productos || []}
        cotizacionId={pedidoSeleccionado?._id}
      />
    </div>
  );
}
