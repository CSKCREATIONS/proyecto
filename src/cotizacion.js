import React, { useState, useEffect } from 'react';
import './Cotizacion.css';

const Cotizacion = () => {
  const [empresa, setEmpresa] = useState('');
  const [para, setPara] = useState('');
  const [paraError, setParaError] = useState('');
  const [nit, setNit] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [fechaError, setFechaError] = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [condicionesPago, setCondicionesPago] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0];
    setFechaActual(fechaFormateada);
    setFecha(fechaFormateada);
  }, []);

  const handleNitKeyPress = (e) => {
    const allowedChars = /[0-9.-]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    setFechaError(selectedDate < fechaActual ? 'No se puede seleccionar una fecha pasada' : '');
  };

  const validatePara = (value) => {
    if (!value.includes('@')) {
      setParaError('El campo debe contener @');
      return false;
    }
    setParaError('');
    return true;
  };

  const handleParaChange = (e) => {
    const value = e.target.value;
    setPara(value);
    validatePara(value);
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: '', cantidad: 1, descripcion: '', precio: 0 }]);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevos = [...productos];
    nuevos[index][campo] = valor;
    setProductos(nuevos);
  };

  const handleEnviarEmail = async () => {
    const isParaValid = validatePara(para);
    if (!isParaValid || fecha < fechaActual) {
      alert('Verifica los campos antes de enviar.');
      return;
    }

    const cotizacion = {
      para,
      empresa,
      nit,
      fecha,
      productos,
      descripcion,
      condicionesPago
    };

    const res = await fetch('http://localhost:3000/api/cotizaciones/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cotizacion)
    });

    if (res.ok) {
      alert('Correo enviado correctamente');
    } else {
      alert('Error al enviar el correo');
    }
  };

  const formatFechaDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cotizacion-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="cotizacion-header">
          <h1>Cotización N.1</h1>
          <div className="action-buttons">
            <button type="button" className="edit-btn">Editar</button>
            <button type="button" className="cancel-btn">Cancelar</button>
            <button type="button" className="send-btn" onClick={handleEnviarEmail}>Enviar</button>
            <button type="button" onClick={handlePrint} className="print-btn">Imprimir</button>
          </div>
        </div>

        <div className="cotizacion-body">
          <div className="company-info">
            <div className="company-name">
              <label htmlFor="empresa">Nombre empresa</label>
              <input
                type="text"
                id="empresa"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                required
              />
            </div>

            <div className="company-logo">
              <label>JLA</label>
              <div className="logo-placeholder">
                {empresa ? empresa.charAt(0).toUpperCase() : 'Logo'}
              </div>
            </div>
          </div>

          <div className="recipient-info">
            <div className="info-row">
              <label htmlFor="para">Para</label>
              <input type="text" id="para" value={para} onChange={handleParaChange} required />
              {paraError && <div className="error-message">{paraError}</div>}
            </div>

            <div className="info-row">
              <label htmlFor="nit">NIT</label>
              <input type="text" id="nit" value={nit} onChange={(e) => setNit(e.target.value)} onKeyPress={handleNitKeyPress} required />
            </div>

            <div className="info-row">
              <label htmlFor="fecha">Fecha</label>
              <input type="date" id="fecha" value={fecha} onChange={handleFechaChange} min={fechaActual} required />
              {fechaError && <div className="error-message">{fechaError}</div>}
              <div className="fecha-display">{formatFechaDisplay(fecha)}</div>
            </div>

            <div className="info-row">
              <label>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            <div className="info-row">
              <label>Condiciones de Pago</label>
              <textarea value={condicionesPago} onChange={(e) => setCondicionesPago(e.target.value)} />
            </div>
          </div>

          <h3>Productos</h3>
          {productos.map((prod, index) => (
            <div key={index} className="producto-item">
              <input type="text" value={prod.nombre} onChange={e => actualizarProducto(index, 'nombre', e.target.value)} placeholder="Producto" />
              <input type="number" value={prod.cantidad} onChange={e => actualizarProducto(index, 'cantidad', e.target.value)} min="1" />
              <input type="text" value={prod.descripcion} onChange={e => actualizarProducto(index, 'descripcion', e.target.value)} placeholder="Descripción" />
              <input type="number" value={prod.precio} onChange={e => actualizarProducto(index, 'precio', e.target.value)} min="0" />
              <button type="button" onClick={() => eliminarProducto(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={agregarProducto}>Agregar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default Cotizacion;