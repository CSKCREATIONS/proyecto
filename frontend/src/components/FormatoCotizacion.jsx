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
  // Generar código de cotización COT-####
  const generarCodigo = () => {
    // Puedes cambiar la lógica para obtener el número real
    const random = Math.floor(1000 + Math.random() * 9000);
    return `COT-${random}`;
  };

  const codigoCotizacion = generarCodigo();

  // Datos de empresa (puedes cambiar por los reales)
  const empresa = {
    nombre: 'JLA GLOBAL COMPANY S.A.S.',
    direccion: 'Cra 123 #45-67, Bogotá',
  };

  return (
    <div className="modal-cotizacion-overlay">
      <div className="modal-cotizacion">
        <button className="close-modal" onClick={onClose}>×</button>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className='modal-title'>{codigoCotizacion}</span>
          <div className="botones-cotizacion" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
            <button className="btn-editar" onClick={() => { onClose(); navigate('/RegistrarCotizacion', { state: { datos } }); }}>Editar</button>
            <button className="btn-remisionar" onClick={() => { }}>Remisionar</button>
            <button className="btn-enviar" onClick={() => setShowEnviarModal(true)}>Enviar</button>
            <button className="btn-imprimir" onClick={() => {
              const pdfBlock = document.getElementById('pdf-cotizacion-block');
              if (!pdfBlock) return window.print();
              // Obtener los estilos de FormatoCotizacion.css
              fetch('/src/components/FormatoCotizacion.css')
                .then(res => res.text())
                .then(css => {
                  const printWindow = window.open('', '', 'width=900,height=700');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Cotización</title>
                        <style>
                          ${css}
                        </style>
                      </head>
                      <body>${pdfBlock.outerHTML}</body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                })
                .catch(() => {
                  // Si falla, imprime sin estilos
                  const printWindow = window.open('', '', 'width=900,height=700');
                  printWindow.document.write(`
                    <html>
                      <head><title>Cotización</title></head>
                      <body>${pdfBlock.outerHTML}</body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                });
            }}>Imprimir</button>
          </div>
        </div>

        {/* Contenido PDF debajo */}
        <div
          className="pdf-cotizacion"
          id="pdf-cotizacion-block"
          style={{ display: 'flex', flexDirection: 'column',background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginTop: '1rem', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', justifyContent: 'center' }}
          onCopy={e => e.preventDefault()}
        >
          <h2>Cotizacion</h2>
          <div className="empresa-info">
            <div className='cotizacion-logo'></div>
            <div style={{ textAlign: 'right' }}>
              <p>{codigoCotizacion}</p>
              <p>{empresa.direccion}</p>
              <p>Fecha: {datos.fecha}</p>
              <p>Cliente: {datos.cliente?.nombre}</p>
              <p>Vendedor: {usuario.firstName || ''} {usuario.surname || ''}</p>
            </div>

          </div>
          <hr />
          <div className="descripcion-cotizacion">
            <h4>Descripción cotización</h4>
            <div dangerouslySetInnerHTML={{ __html: datos.descripcion }} />
          </div>
          <hr />
          <table className="tabla-cotizacion">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Valor Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {datos.productos.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.producto}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.valorUnitario}</td>
                  <td>{p.valorTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <b>Total: </b><p></p>
          <hr />
          <div className="condiciones-pago">
            <h4>Condiciones de pago</h4>
            <div dangerouslySetInnerHTML={{ __html: datos.condicionesPago }} />
          </div>
          <br />
          <p>Cotizacion valida por 30 dias</p>
        </div>

        {showEnviarModal && (
          <div className="modal-cotizacion-overlay">
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
                <input type="text" className="cuadroTexto" value={mensaje} onChange={e => setMensaje(e.target.value)} style={{ width: '100%' }} />
              </div>
              <button className="btn-enviar-modal" style={{ width: '100%' }} onClick={() => { }}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
