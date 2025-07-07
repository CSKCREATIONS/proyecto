// PedidosEntregados.jsx
import React, { useEffect, useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import '../App.css'; // Asegúrate que incluya los estilos de modal que ya usas

export default function PedidosEntregados() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const mostrarProductos = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:5000/api/pedidos?estado=entregado', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log('Pedidos entregados:', data); // 👈 agrega esto
      setPedidos(data);
    })
    .catch(err => console.error('Error al cargar pedidos entregados:', err));
}, []);


  const exportarPDF = () => {
    const input = document.getElementById('tabla_entregados');
    const originalWidth = input.style.width;
    input.style.width = '100%';

    html2canvas(input, {
      scale: 1,
      width: input.offsetWidth,
      windowWidth: input.scrollWidth
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('pedidos_entregados.pdf');

      input.style.width = originalWidth;
    });
  };

  const exportToExcel = () => {
    const table = document.getElementById('tabla_entregados');
    if (!table) return;

    const elementosNoExport = table.querySelectorAll('.no-export');
    elementosNoExport.forEach(el => el.style.display = 'none');

    const workbook = XLSX.utils.table_to_book(table, { sheet: "PedidosEntregados" });
    workbook.Sheets["PedidosEntregados"]["!cols"] = Array(10).fill({ width: 20 });

    XLSX.writeFile(workbook, 'pedidos_entregados.xlsx');
    elementosNoExport.forEach(el => el.style.display = '');
  };

  const handleDevolver = (pedidoId) => {
    Swal.fire({
      title: 'Motivo de devolución',
      input: 'textarea',
      inputLabel: 'Escribe el motivo por el cual se devuelve este pedido:',
      inputPlaceholder: 'Motivo de la devolución...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un motivo.';
        }
      }
    }).then(result => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/pedidos/${pedidoId}/devolver`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ motivo: result.value })
        })
          .then(res => res.json())
          .then(data => {
            Swal.fire('Éxito', 'Pedido devuelto correctamente', 'success');
            setPedidos(prev => prev.filter(p => p._id !== pedidoId));
          })
          .catch(err => {
            console.error(err);
            Swal.fire('Error', 'No se pudo devolver el pedido', 'error');
          });
      }
    });
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
            titulo="Pedidos Entregados"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar='Buscar pedido'
          />
          <div className="container-tabla">
            <div className="table-container">
              <table id="tabla_entregados">
                <thead><br />
                  <tr>
                    <th>No</th>
                    <th># Pedido</th>
                    <th className="no-export">Productos</th>
                    <th>F. Agendamiento</th>
                    <th>F. Entrega</th>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, index) => (
                    <tr key={pedido._id}>
                      <td>{index + 1}</td>
                      <td>{pedido.numeroPedido || `PED-${index + 1}`}</td>
                      <td className="no-export">
                        <button className="btn btn-info" onClick={() => mostrarProductos(pedido)}>
                          Productos
                        </button>
                      </td>
                      <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                      <td>{pedido.cliente?.nombre}</td>
                      <td>{pedido.cliente?.ciudad}</td>
                      <td>{pedido.estado}</td>
                      <td>
                        <button
                          className="btnTransparente"
                          onClick={() => handleDevolver(pedido._id)}
                          title="Devolver pedido"
                        >
                          <i className="fa-solid fa-rotate-left" style={{ color: '#007bff' }}></i>
                        </button>
                      </td>
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