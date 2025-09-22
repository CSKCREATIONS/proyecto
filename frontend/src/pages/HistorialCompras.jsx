// frontend/pages/HistorialCompras.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Fijo from '../components/Fijo';
import NavCompras from '../components/NavCompras';

export default function HistorialCompras() {
  const [compras, setCompras] = useState([]);
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = compras.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(compras.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchCompras = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/compras', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCompras(data.data || data);
      } else {
        Swal.fire('Error', data.message || 'No se pudieron cargar las compras', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  const verDetallesCompra = (compra) => {
    setCompraSeleccionada(compra);
    setModalDetallesVisible(true);
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavCompras />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Historial de Compras</h3>
              <p className='subtitulo'>Compras realizadas a partir de órdenes de compra</p>
            </div>
          </div>

          <br />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Número Orden</th>
                  <th>Proveedor</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Solicitado Por</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((compra, index) => (
                  <tr key={compra._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>
                      <button 
                        onClick={() => verDetallesCompra(compra)} 
                        className="btn btn-link btn-sm p-0"
                        style={{textDecoration: 'none', color: '#007bff', fontWeight: 'bold'}}
                      >
                        {compra.numeroOrden || 'N/A'}
                      </button>
                    </td>
                    <td>{compra.proveedor?.nombre || compra.proveedor || 'Proveedor no especificado'}</td>
                    <td>${compra.total?.toLocaleString()}</td>
                    <td>{new Date(compra.fecha || compra.fechaCompra).toLocaleDateString()}</td>
                    <td>{compra.solicitadoPor || compra.responsable || 'No especificado'}</td>
                  </tr>
                ))}
                {compras.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">No hay compras registradas en el historial</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {compras.length > 0 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? 'active-page' : 'pagination-btn'}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Modal de detalles de la compra */}
          {modalDetallesVisible && compraSeleccionada && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5>Detalles de la Compra: {compraSeleccionada.numeroOrden}</h5>
                  <button className="modal-close" onClick={() => setModalDetallesVisible(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Proveedor:</strong> {compraSeleccionada.proveedor?.nombre || compraSeleccionada.proveedor || 'No especificado'}
                    </div>
                    <div className="col-md-6">
                      <strong>Fecha:</strong> {new Date(compraSeleccionada.fecha || compraSeleccionada.fechaCompra).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Solicitado Por:</strong> {compraSeleccionada.solicitadoPor || compraSeleccionada.responsable || 'No especificado'}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Subtotal:</strong> ${compraSeleccionada.subtotal?.toLocaleString()}
                    </div>
                    <div className="col-md-4">
                      <strong>IVA (19%):</strong> ${compraSeleccionada.impuestos?.toLocaleString()}
                    </div>
                    <div className="col-md-4">
                      <strong>Total:</strong> ${compraSeleccionada.total?.toLocaleString()}
                    </div>
                  </div>

                  {compraSeleccionada.observaciones && (
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <strong>Observaciones:</strong> {compraSeleccionada.observaciones}
                      </div>
                    </div>
                  )}

                  <h6>Productos:</h6>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compraSeleccionada.productos?.map((p, i) => (
                          <tr key={i}>
                            <td>{p.producto?.name || p.producto || 'Producto no especificado'}</td>
                            <td>{p.descripcion || p.producto?.description || 'N/A'}</td>
                            <td>{p.cantidad}</td>
                            <td>${p.precioUnitario?.toLocaleString()}</td>
                            <td>${((p.cantidad || 0) * (p.precioUnitario || 0))?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setModalDetallesVisible(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-400 tracking-wide text-center">
            © 2025{" "}
            <span className="text-yellow-400 font-semibold">
              PANGEA
            </span>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}