import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormatoCotizacion.css';

export default function RemisionPreview({ datos, onClose }) {
  const navigate = useNavigate();
  // Obtener usuario logueado
  const usuario = JSON.parse(localStorage.getItem('user') || '{}');
  const [showEnviarModal, setShowEnviarModal] = useState(false);
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Generar número de remisión si no existe
  const numeroRemision = datos.numeroRemision || `REM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  return (
    <div className="modal-cotizacion-overlay" style={{ alignItems: 'flex-start', paddingTop: '50px', overflow: 'auto' }}>
      <div className="modal-cotizacion" style={{ maxWidth: '95vw', maxHeight: 'none', width: '900px', height: 'auto', marginBottom: '50px' }}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className='modal-title'>Remisión {numeroRemision}</span>
          <div className="botones-cotizacion" style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginBottom: '1rem' }}>
            <button className="btn-cotizacion moderno" title="Confirmar Entrega" onClick={() => {}}>
            </button>
            <button className="btn-cotizacion moderno" title="Enviar" onClick={() => setShowEnviarModal(true)}>
              <i className="fa-solid fa-envelope" style={{ fontSize: '1rem', color: '#EA4335', marginRight: '6px' }}></i>
              Enviar
            </button>
            <button className="btn-cotizacion moderno" title="Imprimir" onClick={() => {
              // Asegurar que solo se imprima este componente
              const printContent = document.getElementById('pdf-remision-block');
              const originalContents = document.body.innerHTML;
              document.body.innerHTML = printContent.outerHTML;
              window.print();
              document.body.innerHTML = originalContents;
              window.location.reload(); // Recargar para restaurar funcionalidad
            }}>
              <i className="fa-solid fa-print" style={{ fontSize: '1.2rem', marginRight: '8px' }}></i>
            </button>
          </div>
        </div>

        {/* Contenido PDF debajo */}
        <div
          className="pdf-cotizacion"
          id="pdf-remision-block"
          style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
            marginTop: '0.5rem', 
            userSelect: 'none', 
            WebkitUserSelect: 'none', 
            MozUserSelect: 'none', 
            msUserSelect: 'none', 
            fontSize: '0.9rem',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}
          onCopy={e => e.preventDefault()}
        >
          <div className="cotizacion-encabezado">
            <h2 style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>REMISIÓN</h2>
          </div>

          {/* Información de envío */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#374151', marginBottom: '0.3rem', fontSize: '0.85rem' }}>ENTREGAR A:</h4>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.15rem', fontSize: '0.8rem' }}>
                  {datos.cliente?.nombre || 'Cliente no especificado'}
                </p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                  {datos.cliente?.direccion || 'Dirección no especificada'}
                </p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                  {datos.cliente?.ciudad || 'Ciudad no especificada'}
                </p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                  Tel: {datos.cliente?.telefono || 'No especificado'}
                </p>
                <p style={{ fontSize: '0.75rem' }}>
                  {datos.cliente?.correo || 'Sin correo'}
                </p>
              </div>
            </div>
            
            <div style={{ flex: 1, marginLeft: '1rem' }}>
              <h4 style={{ color: '#374151', marginBottom: '0.3rem', fontSize: '0.85rem' }}>REMITE:</h4>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.15rem', fontSize: '0.8rem' }}>{datos.empresa?.nombre || 'PANGEA'}</p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>{datos.empresa?.direccion || ''}</p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>Responsable: {usuario.firstName || ''} {usuario.surname || ''}</p>
                <p style={{ marginBottom: '0.15rem', color: '#6b7280', fontSize: '0.75rem' }}>
                  Ref. Pedido: {datos.numeroPedido || datos.codigo || 'N/A'}
                </p>
                {(datos.numeroCotizacion || datos.cotizacion?.numero) && (
                  <p style={{ marginBottom: '0.15rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    Ref. Cotización: {datos.numeroCotizacion || datos.cotizacion?.numero}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr />

          {/* Información del envío */}
          {datos.observacion && (
            <div style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#374151', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Observaciones:</h4>
              <div style={{ backgroundColor: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
                <p style={{ margin: 0, fontSize: '0.75rem' }}>{datos.observacion}</p>
              </div>
            </div>
          )}

          {/* Tabla de productos */}
          <table className="tabla-cotizacion" style={{ fontSize: '0.8rem', width: '100%', marginBottom: '1rem' }}>
              <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ textAlign: 'left', padding: '0.6rem', fontSize: '0.8rem' }}>Cant.</th>
                <th style={{ textAlign: 'left', padding: '0.6rem', fontSize: '0.8rem' }}>Producto</th>
                <th style={{ textAlign: 'left', padding: '0.6rem', fontSize: '0.8rem' }}>Descripción</th>
                <th style={{ textAlign: 'right', padding: '0.6rem', fontSize: '0.8rem' }}>Valor Unit.</th>
                <th style={{ textAlign: 'right', padding: '0.6rem', fontSize: '0.8rem' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {datos.productos && datos.productos.length > 0 ? datos.productos.map((p, idx) => {
                console.log('Producto en remisión:', p); // Debug
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {p.cantidad || 0}
                    </td>
                    <td style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                      {p.product?.name || p.producto?.name || p.nombre || 'Producto sin nombre'}
                    </td>
                    <td style={{ padding: '0.6rem', fontSize: '0.8rem', color: '#6b7280' }}>
                      {p.product?.description || p.descripcion || 'Sin descripción'}
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.8rem' }}>
                      ${(p.valorUnitario || p.precioUnitario || p.product?.price || 0).toLocaleString('es-CO')}
                    </td>
                    <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      ${(() => {
                        const cantidad = parseFloat(p.cantidad) || 0;
                        const precio = parseFloat(p.valorUnitario || p.precioUnitario || p.product?.price) || 0;
                        return (cantidad * precio).toLocaleString('es-CO');
                      })()}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.9rem' }}>
                  TOTAL A ENTREGAR:
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1rem', color: '#059669' }}>
                  ${datos.productos && datos.productos.length > 0 ? datos.productos
                    .reduce((acc, p) => {
                      const cantidad = parseFloat(p.cantidad) || 0;
                      const precio = parseFloat(p.valorUnitario || p.precioUnitario || p.product?.price) || 0;
                      return acc + (cantidad * precio);
                    }, 0)
                    .toLocaleString('es-CO') : '0'}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Sección de firmas */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1rem', 
            paddingTop: '0.75rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ borderTop: '1px solid #374151', marginTop: '1.5rem', paddingTop: '0.3rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>ENTREGADO POR:</p>
                <p style={{ fontSize: '0.65rem', color: '#6b7280', margin: 0 }}>
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', flex: 1, marginLeft: '1rem' }}>
              <div style={{ borderTop: '1px solid #374151', marginTop: '1.5rem', paddingTop: '0.3rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>RECIBIDO POR:</p>
                <p style={{ fontSize: '0.65rem', color: '#6b7280', margin: 0 }}>
                </p>
              </div>
            </div>
          </div>

          {/* Términos y condiciones */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#f8fafc', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0'
          }}>
            <h5 style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '0.4rem' }}>TÉRMINOS Y CONDICIONES:</h5>
            <ul style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0, paddingLeft: '1rem', lineHeight: '1.3' }}>
              <li>El cliente debe verificar la mercancía al momento de la entrega</li>
              <li>Los reclamos por daños o faltantes deben realizarse en el momento de la entrega</li>
              <li>Una vez firmada la remisión, se da por aceptada la mercancía en perfectas condiciones</li>
            </ul>
          </div>
        </div>
      </div>

      {showEnviarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-cotizacion" style={{ maxWidth: 400 }}>
            <button className="close-modal" onClick={() => setShowEnviarModal(false)}>×</button>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Enviar remisión</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label>Correo destinatario:</label>
              <input type="email" className="cuadroTexto" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Asunto:</label>
              <input type="text" className="cuadroTexto" value={asunto} onChange={e => setAsunto(e.target.value)} style={{ width: '100%' }} placeholder={`Remisión ${numeroRemision}`} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Mensaje:</label>
              <textarea className="cuadroTexto" value={mensaje} onChange={e => setMensaje(e.target.value)} style={{ width: '100%', minHeight: '80px' }} placeholder="Adjunto remisión de productos para su entrega..." />
            </div>
            <button className="btn-enviar-modal" style={{ width: '100%' }} onClick={() => { }}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}