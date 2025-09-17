import React, { useEffect, useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


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

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_devueltos');
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('pedidosDevueltos.pdf');
  });
};


const exportToExcel = () => {
  const table = document.getElementById('tabla_pedidos_devueltos');
  if (!table) return;
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'pedidosDevueltos.xlsx');
};

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Pedidos devueltos</h3>
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
                  {pedidos.length === 0 && <tr><td colSpan="9">No hay pedidos devueltos disponibles</td></tr>}
                </tbody>
              </table>
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
