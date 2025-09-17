import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormatoCotizacion.css';

export default function FormatoCotizacion({ datos, onClose }) {
  const navigate = useNavigate();
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
    nombre: 'PANGEA S.A.S.',
    direccion: 'Cra 123 #45-67, Bogotá',
  };

  return (
    <div className="modal-cotizacion-overlay">
      <div className="modal-cotizacion">
        <button className="close-modal" onClick={onClose}>×</button>
        <h2 className="modal-title">{codigoCotizacion}</h2>
        <div className="botones-cotizacion" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
          <button className="btn-editar" onClick={() => { onClose(); navigate('/RegistrarCotizacion', { state: { datos } }); }}>Editar</button>
          <button className="btn-remisionar" onClick={() => {}}>Remisionar</button>
          <button className="btn-enviar" onClick={() => setShowEnviarModal(true)}>Enviar</button>
          <button className="btn-imprimir" onClick={() => window.print()}>Imprimir</button>
        </div>
  <div className="empresa-info">
          <div><strong>{empresa.nombre}</strong></div>
          <div>{empresa.direccion}</div>
          <div>Fecha: {datos.fecha}</div>
          <div>Cliente: {datos.cliente?.nombre}</div>
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
        <hr />
        <div className="condiciones-pago">
          <h4>Condiciones de pago</h4>
          <div dangerouslySetInnerHTML={{ __html: datos.condicionesPago }} />
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
              <button className="btn-enviar-modal" style={{ width: '100%' }} onClick={() => {}}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
