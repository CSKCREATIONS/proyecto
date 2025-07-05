import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo2 from '../components/EncabezadoModulo2'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState, useEffect } from 'react';
import { mostrarPopupCotizacion } from '../funciones/popupEnviarCotizacion';

export default function RegistrarCotizacion() {
  const navigate = useNavigate();
  const descripcionRef = useRef(null);
  const condicionesPagoRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Productos cargados:', data);
        setProductos(data.data || []);
      })
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const agregarProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, {
      producto: '',
      descripcion: '',
      cantidad: '',
      valorUnitario: '',
      descuento: '',
      valorTotal: ''
    }]);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos.splice(index, 1);
    setProductosSeleccionados(nuevosProductos);
  };


  

  const eliminarTodosLosProductos = () => {
  if (productosSeleccionados.length === 0) return;

  Swal.fire({
    title: '¿Eliminar todos los productos?',
    text: 'Esta acción eliminará todos los productos seleccionados de la cotización.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar todos',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {
      setProductosSeleccionados([]);
      Swal.fire('Eliminados', 'Todos los productos fueron eliminados.', 'success');
    }
  });
};


  const handleProductoChange = (index, value) => {
    const producto = productos.find(p => p._id === value);
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index] = {
      ...nuevosProductos[index],
      producto: value,
      descripcion: producto?.description || '',
      valorUnitario: producto?.price || '',
      cantidad: '',
      descuento: '',
      valorTotal: ''
    };
    setProductosSeleccionados(nuevosProductos);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][name] = value;
    actualizarTotal(index, nuevosProductos);
  };

  const actualizarTotal = (index, productosArray) => {
    const { cantidad = 0, valorUnitario = 0, descuento = 0 } = productosArray[index];
    const cantidadNum = parseFloat(cantidad) || 0;
    const valorNum = parseFloat(valorUnitario) || 0;
    const descNum = parseFloat(descuento) || 0;
    const subtotal = cantidadNum * valorNum;
    productosArray[index].valorTotal = (subtotal - (subtotal * descNum / 100)).toFixed(2);
    setProductosSeleccionados([...productosArray]);
  };

  const handleCancelado = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas borrar el contenido de esta cotización?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        setProductosSeleccionados([]);
        Swal.fire('Borrada', 'Registro borrado exitosamente.', 'success');
      }
    });
  };
  

  function obtenerFechaLocal(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleGuardarCotizacion = async (enviar = false) => {
    const inputs = document.querySelectorAll('.cuadroTexto');

    const clienteData = {
      nombre: inputs[0]?.value.trim() || '',
      ciudad: inputs[1]?.value.trim() || '',
      direccion: inputs[2]?.value.trim() || '',
      telefono: inputs[3]?.value.trim() || '',
      correo: inputs[4]?.value.trim() || '',
      esCliente: false
    };

    if (!clienteData.nombre || !clienteData.correo || !clienteData.telefono || !clienteData.ciudad) {
      Swal.fire('Error', 'Todos los campos del cliente son obligatorios.', 'warning');
      return;
    }

    const token = localStorage.getItem('token');

    let clienteGuardado = null;
    try {
      const clienteResponse = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clienteData)
      });

      const clienteResult = await clienteResponse.json();

      if (!clienteResponse.ok) {
        console.error('Error al guardar cliente:', clienteResult);
        Swal.fire('Error', clienteResult.message || 'No se pudo guardar el cliente.', 'error');
        return;
      }

      clienteGuardado = clienteResult.data || clienteResult;
    } catch (error) {
      console.error('Error en la solicitud de cliente:', error);
      Swal.fire('Error', 'Error de red al guardar cliente.', 'error');
      return;
    }

    const datosCotizacion = {
      cliente: clienteData,
      ciudad: clienteData.ciudad,
      telefono: clienteData.telefono,
      correo: clienteData.correo,
      responsable: 'Pepito',
      fecha: obtenerFechaLocal(inputs[5]?.value),
      descripcion: descripcionRef.current?.getContent({ format: 'html' }) || '',
      condicionesPago: condicionesPagoRef.current?.getContent({ format: 'html' }) || '',
      productos: productosSeleccionados.map(p => ({
      producto: p.producto, // ✅ Asegúrate que sea el ID del producto
      descripcion: p.descripcion,
      cantidad: parseFloat(p.cantidad || 0),
      valorUnitario: parseFloat(p.valorUnitario || 0),
      descuento: parseFloat(p.descuento || 0),
      valorTotal: parseFloat(p.valorTotal || 0)
    })),

      clientePotencial: true,
      enviadoCorreo: enviar
    };

    try {
      const cotizacionResponse = await fetch('http://localhost:3000/api/cotizaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosCotizacion)
      });

      const cotizacionResult = await cotizacionResponse.json();

      if (!cotizacionResponse.ok) {
        console.error('Error al guardar cotización:', cotizacionResult);
        Swal.fire('Error', cotizacionResult.message || 'No se pudo guardar la cotización.', 'error');
        return;
      }

      Swal.fire('Éxito', 'Cotización registrada correctamente.', 'success');
      navigate('/ListaDeCotizaciones');

    } catch (error) {
      console.error('Error en la solicitud de cotización:', error);
      Swal.fire('Error', 'Error de red al guardar cotización.', 'error');
    }
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo2 titulo="Registrar cotizacion" />
          <br />
          {/* Datos cliente */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Responsable cotización</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" className="cuadroTexto" placeholder="Nombre o razón social" /></td>
                  <td><input type="text" className="cuadroTexto" placeholder="Ciudad" /></td>
                  <td><input type="text" className="cuadroTexto" placeholder="Dirección" /></td>
                  <td><input type="text" className="cuadroTexto" placeholder="Teléfono" /></td>
                  <td><input type="text" className="cuadroTexto" placeholder="Correo electrónico" /></td>
                  <td><span>Pepito</span></td>
                  <td><input type="date" className="cuadroTexto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <br />
          <label className="labelDOCS">Descripción cotización</label>
          <Editor
            onInit={(evt, editor) => (descripcionRef.current = editor)}
            apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"
            textareaName="Descripcion"
            init={{ height: 250, menubar: false }}
          />

          <br />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Valor unitario</th>
                  <th>% Descuento</th>
                  <th>Valor total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((prod, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <select
                        className="cuadroTexto"
                        value={prod.producto}
                        onChange={(e) => handleProductoChange(index, e.target.value)}
                      >
                        <option value="">Seleccione un producto</option>
                        {productos.map(p => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td><input type="text" name="descripcion" className='cuadroTexto' value={prod.descripcion} onChange={(e) => handleChange(index, e)} /></td>
                    <td><input type="number" name="cantidad" className='cuadroTexto' value={prod.cantidad} onChange={(e) => handleChange(index, e)} /></td>
                    <td><input type="number" name="valorUnitario" className='cuadroTexto' value={prod.valorUnitario} onChange={(e) => handleChange(index, e)} /></td>
                    <td><input type="number" name="descuento" className='cuadroTexto' value={prod.descuento} onChange={(e) => handleChange(index, e)} /></td>
                    <td><input type="number" name="valorTotal" className='cuadroTexto' value={prod.valorTotal} readOnly /></td>
                    <td><button className="btn btn-danger" onClick={() => eliminarProducto(index)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <button className="btn" onClick={agregarProducto}>Agregar Producto</button>
            {productosSeleccionados.length > 0 && (
              <button className="btn btn-danger" onClick={eliminarTodosLosProductos} style={{ marginLeft: '10px' }}>
                Eliminar Todos
              </button>
            )}
          </div>

          <br />
          <label className="labelDOCS">Condiciones de pago</label>
          <Editor
            onInit={(evt, editor) => (condicionesPagoRef.current = editor)}
            apiKey="otu4s642tv612posr0ne65wrxy2i5kmop915g2gu2zbv5mho"
            textareaName="Condiciones"
            init={{ height: 300, menubar: false }}
          />

          <div className="buttons">
            <button className="btn btn-primary-cancel" onClick={handleCancelado}>Cancelar</button>
            <button className="btn btn-primary-guardar" onClick={() => handleGuardarCotizacion(false)}>Guardar</button>
            <button className="btn btn-primary-env" onClick={() => handleGuardarCotizacion(true)}>Guardar y Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

