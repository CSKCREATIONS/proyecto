import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormatoCotizacion.css';

export default function FormatoCotizacion({ datos, onClose }) {
  const navigate = useNavigate();
  // Obtener usuario logueado
  const usuario = JSON.parse(localStorage.getItem('user') || '{}');
  const [showEnviarModal, setShowEnviarModal] = useState(false);
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');



  // Obtener lista de productos para mostrar el nombre
  const productosLista = datos.productosLista || [];

  // Usar datos de la cotización (traídos del backend) para empresa si existen
  // Ejemplo: datos.empresa = { nombre, direccion }
  console.log("productosLista:", productosLista);

  return (


    <div className="modal-cotizacion-overlay" style={{ alignItems: 'flex-start', paddingTop: '50px', overflow: 'auto' }}>
      <div className="modal-cotizacion" style={{ maxWidth: '95vw', maxHeight: 'none', width: '900px', height: 'auto', marginBottom: '50px' }}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className='modal-title'>
            {datos.tipo === 'pedido' ? 'Pedido Agendado' : (datos.codigo ? datos.codigo : '')}
          </span>
          <div className="botones-cotizacion" style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginBottom: '1rem' }}>
            {datos.tipo !== 'pedido' && (
              <button className="btn-cotizacion moderno" title="Editar" onClick={() => { onClose(); navigate('/RegistrarCotizacion', { state: { datos } }); }}>
                <i className="fa-solid fa-pen" style={{ fontSize: '1.2rem', marginRight: '8px' }}></i>
                Editar
              </button>
            )}
            {datos.tipo !== 'pedido' && (
              <button className="btn-cotizacion moderno" title="Remisionar" onClick={() => { }}>
                <i className="fa-solid fa-file-invoice" style={{ fontSize: '1.2rem', marginRight: '8px' }}></i>
                Remisionar
              </button>
            )}
            <button className="btn-cotizacion moderno" title="Enviar" onClick={() => setShowEnviarModal(true)}>
              <i className="fa-solid fa-envelope" style={{ fontSize: '1rem', color: '#EA4335', marginRight: '6px' }}></i>
              Enviar
            </button>
            <button className="btn-cotizacion moderno" title="Imprimir" onClick={() => {
              // Asegurar que solo se imprima este componente
              const printContent = document.getElementById('pdf-cotizacion-block');
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
          id="pdf-cotizacion-block"

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
            <h2 style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              {datos.tipo === 'pedido' ? 'PEDIDO AGENDADO' : 'COTIZACIÓN'}
            </h2>
          </div>
          {/* Información del cliente y empresa */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#374151', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                {datos.tipo === 'pedido' ? 'ENTREGAR A:' : 'CLIENTE:'}
              </h4>
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
              <h4 style={{ color: '#374151', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                {datos.tipo === 'pedido' ? 'REMITE:' : 'EMPRESA:'}
              </h4>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.15rem', fontSize: '0.8rem' }}>
                  {datos.empresa?.nombre || 'PANGEA'}
                </p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                  {datos.empresa?.direccion || ''}
                </p>
                <p style={{ marginBottom: '0.15rem', fontSize: '0.75rem' }}>
                  Responsable: {usuario.firstName || ''} {usuario.surname || ''}
                </p>
                {datos.codigo && (
                  <p style={{ marginBottom: '0.15rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    Ref. {datos.tipo === 'pedido' ? 'Pedido' : 'Cotización'}: {datos.codigo}
                  </p>
                )}
                {datos.fechaEntrega && (
                  <p style={{ marginBottom: '0.15rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    F. Entrega: {new Date(datos.fechaEntrega).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>
          </div>
          <hr />
          {/* Descripción */}
          {datos.descripcion && (
            <div style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#374151', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                {datos.tipo === 'pedido' ? 'Descripción del pedido:' : 'Descripción de la cotización:'}
              </h4>
              <div style={{ backgroundColor: '#fffbeb', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
                <div style={{ margin: 0, fontSize: '0.75rem' }} dangerouslySetInnerHTML={{ __html: datos.descripcion }} />
              </div>
              {datos.tipo === 'pedido' && datos.estadoPedido && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Estado del pedido: </span>
                  <span style={{ 
                    backgroundColor: datos.estadoPedido === 'pendiente' ? '#fef3c7' : 
                                   datos.estadoPedido === 'completado' ? '#d4edda' : '#f8d7da',
                    color: datos.estadoPedido === 'pendiente' ? '#f59e0b' : 
                           datos.estadoPedido === 'completado' ? '#155724' : '#721c24',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {datos.estadoPedido.charAt(0).toUpperCase() + datos.estadoPedido.slice(1)}
                  </span>
                </div>
              )}
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
                <th style={{ textAlign: 'right', padding: '0.6rem', fontSize: '0.8rem' }}>% Desc.</th>
                <th style={{ textAlign: 'right', padding: '0.6rem', fontSize: '0.8rem' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {datos.productos && datos.productos.length > 0 ? datos.productos.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {p.cantidad || 0}
                  </td>
                  <td style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                    {p.producto?.name || p.nombre || 'Producto sin nombre'}
                  </td>
                  <td style={{ padding: '0.6rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    {p.producto?.description || p.descripcion || 'Sin descripción'}
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.8rem' }}>
                    ${(p.valorUnitario || 0).toLocaleString('es-CO')}
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.8rem' }}>
                    {p.descuento || 0}%
                  </td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    ${(() => {
                      const cantidad = parseFloat(p.cantidad) || 0;
                      const valorUnitario = parseFloat(p.valorUnitario) || 0;
                      const descuento = parseFloat(p.descuento) || 0;
                      const subtotal = cantidad * valorUnitario * (1 - descuento / 100);

                      return subtotal.toLocaleString('es-CO');
                    })()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                <td colSpan={5} style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.9rem' }}>
                  TOTAL {datos.tipo === 'pedido' ? 'PEDIDO' : 'COTIZACIÓN'}:
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1rem', color: '#059669' }}>
                  ${datos.productos && datos.productos.length > 0 ? datos.productos
                    .reduce((acc, p) => {
                      const cantidad = parseFloat(p.cantidad) || 0;
                      const valorUnitario = parseFloat(p.valorUnitario) || 0;
                      const descuento = parseFloat(p.descuento) || 0;
                      const subtotal = cantidad * valorUnitario * (1 - descuento / 100);
                      return acc + subtotal;
                    }, 0)
                    .toLocaleString('es-CO') : '0'}
                </td>
              </tr>
            </tfoot>
          </table>
          {/* Condiciones de pago */}
          {datos.condicionesPago && (
            <div style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ color: '#374151', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Condiciones de pago:</h4>
              <div style={{ backgroundColor: '#f0f9ff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                <div style={{ margin: 0, fontSize: '0.75rem' }} dangerouslySetInnerHTML={{ __html: datos.condicionesPago }} />
              </div>
            </div>
          )}

          {/* Validez de cotización */}
          {datos.tipo !== 'pedido' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textAlign: 'center', fontStyle: 'italic' }}>
                Cotización válida por 15 días
              </p>
            </div>
          )}
        </div>

      </div>

      {showEnviarModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-cotizacion" style={{ maxWidth: 400 }}>
              <button className="close-modal" onClick={() => setShowEnviarModal(false)}>×</button>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Enviar cotización</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label>Correo destinatario:</label>
                <input type="email" className="cuadroTexto" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Asunto:</label>
                <input type="text" className="cuadroTexto" value={asunto} onChange={e => setAsunto(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Mensaje:</label>
                <textarea className="cuadroTexto" value={mensaje} onChange={e => setMensaje(e.target.value)} style={{ width: '100%', minHeight: '80px' }} />
              </div>
              <button className="btn-enviar-modal" style={{ width: '100%' }} onClick={() => { }}>Enviar</button>
            </div>
          </div>
        )}
    </div>
  );
}
