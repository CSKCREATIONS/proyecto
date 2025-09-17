import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function PedidosDespachados() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const mostrarProductos = (pedido) => {
    setPedidoSeleccionado(pedido);
  };


  const exportarPDF = () => {
    const input = document.getElementById('tabla_despachados');
    const originalWidth = input.style.width;
    input.style.width = '100%';

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('pedidos_despachados.pdf');

      input.style.width = originalWidth;
    });
  };

  const exportToExcel = () => {
    const table = document.getElementById('tabla_despachados');
    if (!table) return;

    const elementosNoExport = table.querySelectorAll('.no-export');
    elementosNoExport.forEach(el => el.style.display = 'none');

    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Pedidos Despachados' });
    XLSX.writeFile(workbook, 'pedidos_despachados.xlsx');

    elementosNoExport.forEach(el => el.style.display = '');
  };


  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setPedidos(data.filter(p => p.estado === 'despachado')))
      .catch(err => console.error('Error al cargar pedidos:', err));
  };

  const marcarComoEntregado = async (idPedido) => {
    const token = localStorage.getItem('token');

    const confirmar = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto marcará el pedido como entregado y generará una venta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) return;

    try {
      const result = await fetch(`http://localhost:5000/api/pedidos/${idPedido}/entregar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // ✅ necesario si la ruta está protegida
        }
      });

      if (result.ok) {
        Swal.fire('¡Éxito!', 'El pedido fue marcado como entregado.', 'success');
        obtenerPedidos(); // 👈 recarga la lista de pedidos despachados
      } else {
        Swal.fire('Error', 'No se pudo entregar el pedido.', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el pedido', 'error');
    }
  };

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
                    <strong>{prod?.product?.name || 'Producto desconocido'}</strong><br />
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

  const totalPages = Math.ceil(pedidos.length / itemsPerPage);
  const currentItems = pedidos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Pedidos despachados</h3>
              {/* BOTONES EXPORTAR */}
              <button
                onClick={() => exportToExcel(pedidos)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', border: '1.5px solid #16a34a', borderRadius: '8px', background: 'transparent', color: '#16a34a',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-excel" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a Excel</span>
              </button>

              <button
                onClick={exportarPDF}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', border: '1.5px solid #dc2626', borderRadius: '8px', background: 'transparent', color: '#dc2626',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-pdf" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a PDF</span>
              </button>
            </div>
          </div>
          <div className="container-tabla">
            <div className="table-container">
              <table id="tabla_despachados">
                <thead><br />
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>F. Agendamiento</th>
                    <th>F. Entrega</th>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th className="no-export">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pedido, index) => (
                    <tr key={pedido._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{pedido.numeroPedido || '---'}</td>
                      <td>
                        <button className="btn btn-info" onClick={() => mostrarProductos(pedido)}>
                          Productos
                        </button>
                      </td>
                      <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                      <td>{pedido.cliente?.nombre}</td>
                      <td>{pedido.cliente?.ciudad}</td>
                      <td>{pedido.estado}</td>
                      <td className="no-export">
                        <button
                          className="btn btn-success"
                          onClick={() => marcarComoEntregado(pedido._id)}
                        >
                          Marcar como entregado
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pedidos.length === 0 && <tr><td colSpan="9">No hay pedidos despachados disponibles disponibles</td></tr>}
                </tbody>
              </table>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? 'active-page' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 tracking-wide text-center">
          © 2025{" "}
          <span className="text-yellow-400 font-semibold transition duration-300 hover:text-yellow-300 hover:brightness-125">
            PANGEA
          </span>
          . Todos los derechos reservados.
        </p>
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
