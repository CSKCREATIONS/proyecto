// PedidosEntregados.jsx
import React, { useEffect, useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import RemisionPreview from '../components/RemisionPreview';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import '../App.css'; // Asegúrate que incluya los estilos de modal que ya usas

export default function PedidosEntregados() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarRemision, setMostrarRemision] = useState(false);
  const [datosRemision, setDatosRemision] = useState(null);

  const mostrarProductos = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  const generarRemision = async (pedido) => {
    try {
      const token = localStorage.getItem('token');

      // Primero obtener los datos completos del pedido con productos poblados
      const resPedido = await fetch(`http://localhost:5000/api/pedidos/${pedido._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!resPedido.ok) {
        throw new Error('No se pudo obtener el pedido completo');
      }

      const pedidoCompleto = await resPedido.json();
      console.log('Datos del pedido para remisión:', pedidoCompleto); // Debug para verificar datos

      // Intentar obtener la cotización si existe referencia
      let cotizacionData = null;
      if (pedidoCompleto.cotizacionReferenciada || pedidoCompleto.cotizacionId) {
        try {
          const id = pedidoCompleto.cotizacionReferenciada || pedidoCompleto.cotizacionId;
          const resCotizacion = await fetch(`http://localhost:5000/api/cotizaciones/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (resCotizacion.ok) {
            const data = await resCotizacion.json();
            cotizacionData = data.data || data;
          }
        } catch (err) {
          // No se pudo obtener cotización, continuar solo con datos del pedido
        }
      }

      // Crear objeto de remisión
      const datosRemision = {
        // Datos básicos del pedido
        numeroPedido: pedidoCompleto.numeroPedido,
        fechaEntrega: pedidoCompleto.fechaEntrega,
        fechaAgendamiento: pedidoCompleto.createdAt,
        estado: pedidoCompleto.estado,
        cliente: pedidoCompleto.cliente,
        productos: pedidoCompleto.productos || [],
        observacion: pedidoCompleto.observacion || 'Entrega de productos según pedido',
        numeroRemision: `REM-${pedidoCompleto.numeroPedido?.slice(-6) || Math.random().toString(36).substr(2, 6).toUpperCase()}`,

        // Si hay cotización, agregar datos adicionales
        ...(cotizacionData && {
          numeroCotizacion: cotizacionData.numeroCotizacion || cotizacionData.numero,
          descripcion: cotizacionData.descripcion,
          condicionesPago: cotizacionData.condicionesPago,
          empresa: cotizacionData.empresa
        })
      };

      setDatosRemision(datosRemision);
      setMostrarRemision(true);

    } catch (error) {
      console.error('Error al generar remisión:', error);
      Swal.fire('Error', 'No se pudo generar la remisión: ' + error.message, 'error');
    }
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


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Pedidos entregados</h3>
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

          <div className="max-width">
            <div className="container-tabla">
              <div className="table-container">
                <table id="tabla_entregados">
                  <thead><br />
                    <tr>
                      <th>No</th>
                      <th># Pedido</th>
                      <th>F. Agendamiento</th>
                      <th>F. Entrega</th>
                      <th>Cliente</th>
                      <th>Ciudad</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido, index) => (
                      <tr key={pedido._id}>
                        <td>{index + 1}</td>
                        <td>
                          <a
                            style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline', fontWeight: 'bold' }}
                            onClick={() => generarRemision(pedido)}
                            title="Clic para ver remisión"
                          >
                            {pedido.numeroPedido || `PED-${index + 1}`}
                          </a>
                        </td>
                        <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                        <td>{pedido.cliente?.nombre}</td>
                        <td>{pedido.cliente?.ciudad}</td>
                        <td>
                          <strong style={{ color: '#28a745', fontSize: '14px' }}>
                            ${(pedido.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </td>
                        <td>
                          <span style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {pedido.estado.toUpperCase()}
                          </span>
                        </td>
                        <td className="no-export">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleDevolver(pedido._id)}
                            title="Devolver pedido"
                          >
                            <i className="fa-solid fa-rotate-left" style={{ marginRight: '5px' }}></i>
                            Devolver
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && <tr><td colSpan="9">No hay pedidos entregados disponibles</td></tr>}
                  </tbody>
                </table>
              </div>
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

      {mostrarRemision && datosRemision && (
        <RemisionPreview
          datos={datosRemision}
          onClose={() => { setMostrarRemision(false); setDatosRemision(null); }}
        />
      )}

      <div className="custom-footer">
        <p className="custom-footer-text">
          © 2025 <span className="custom-highlight">PANGEA</span>. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}