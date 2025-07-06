import React, { useState, useEffect } from 'react';

const Cotizacion = () => {
  // Estados del formulario
  const [empresa, setEmpresa] = useState('');
  const [para, setPara] = useState('');
  const [paraError, setParaError] = useState(''); // Nuevo estado para error del campo Para
  const [nit, setNit] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [fechaError, setFechaError] = useState('');
  const [fechaActual, setFechaActual] = useState('');

  // Función para bloquear caracteres no permitidos en el NIT
  const handleNitKeyPress = (e) => {
    const allowedChars = /[0-9.-]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault(); // Cancela la entrada si no es número, guión o punto
    }
  };

  // Obtener fecha actual al cargar el componente
  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0];
    setFechaActual(fechaFormateada);
    setFecha(fechaFormateada); // Establecer fecha actual como valor inicial
  }, []);

  // Validar fecha al cambiar
  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    
    if (selectedDate < fechaActual) {
      setFechaError('No se puede seleccionar una fecha pasada');
    } else {
      setFechaError('');
    }
  };

  // Validar campo Para que contenga @
  const validatePara = (value) => {
    if (!value.includes('@')) {
      setParaError('El campo debe terminar en: @exaple.com');
      return false;
    }
    setParaError('');
    return true;
  };

  // Manejar cambio en campo Para
  const handleParaChange = (e) => {
    const value = e.target.value;
    setPara(value);
    validatePara(value);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación del campo Para
    const isParaValid = validatePara(para);
    
    // Validación final de fecha
    if (fecha < fechaActual) {
      setFechaError('No se puede enviar una cotización con fecha pasada');
      return;
    }
    
    // Si hay errores, no enviar 
    if (fechaError || !isParaValid) {
      return;
    }

    alert(`Cotización enviada para: ${para}\nFecha: ${formatFechaDisplay(fecha)}`);
    // Aquí iría la lógica para enviar los datos
  };

  // Función para formatear la fecha visualmente (DD/MM/AAAA)
  const formatFechaDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cotizacion-container">
      <form onSubmit={handleSubmit}>
        <div className="cotizacion-header">
          <h1>Cotización N.1</h1>
          <div className="action-buttons">
            <button type="button" className="edit-btn">Editar</button>
            <button type="button" className="cancel-btn">Cancelar</button>
            <button type="submit" className="send-btn">Enviar</button>
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
              <input
                type="text"
                id="para"
                value={para}
                onChange={handleParaChange}  // llama la función para que nesesite el @ obligatorio
                required
              />
              {paraError && <div className="error-message">{paraError}</div>}  {/* Mensaje de error */}
            </div>

            <div className="info-row">
              <label htmlFor="nit">NIT</label>
              <input
                type="text"
                id="nit"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                onKeyPress={handleNitKeyPress} // se utiliza para que la funcion no deje entrar otros caracteres que no sean "0-9.-"
                required
              />
            </div>

            <div className="info-row">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="info-row">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={handleFechaChange}
                min={fechaActual}
                required
              />
              {fechaError && <div className="error-message">{fechaError}</div>}
              <div className="fecha-display">
                {formatFechaDisplay(fecha)}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Cotizacion;