import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState, useEffect } from 'react';
import FormatoCotizacion from '../components/FormatoCotizacion';

export default function RegistrarCotizacion() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const descripcionRef = useRef(null);
  const condicionesPagoRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mostrarFormato, setMostrarFormato] = useState(false);
  const [datosFormato, setDatosFormato] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProductos(data.data || []))
      .catch(err => console.error('Error al cargar productos:', err));

  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      setUser(usuario);
    }
  }, []);


  const agregarProducto = () => {
    setProductosSeleccionados([...productosSeleccionados, {
      producto: '', descripcion: '', cantidad: '', valorUnitario: '', descuento: '', valorTotal: ''
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
        // Limpiar todos los inputs del formulario principal
        const inputIds = ['cliente', 'ciudad', 'direccion', 'telefono', 'email', 'fecha'];
        inputIds.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.value = '';
        });

        // Limpiar productos seleccionados
        setProductosSeleccionados([]);

        // Limpiar editores TinyMCE
        if (descripcionRef.current) {
          descripcionRef.current.setContent('');
        }
        if (condicionesPagoRef.current) {
          condicionesPagoRef.current.setContent('');
        }
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


  const handleGuardarCotizacion = async (enviar = false, mostrarModal = false) => {
    const inputs = document.querySelectorAll('.cuadroTexto');

    // Validar campos obligatorios
    const nombre = inputs[0]?.value.trim();
    const ciudad = inputs[1]?.value.trim();
    const direccion = inputs[2]?.value.trim();
    const telefono = inputs[3]?.value.trim();
    const correo = inputs[4]?.value.trim();
    const fecha = inputs[6]?.value;

    if (!nombre || !ciudad || !direccion || !telefono || !correo || !fecha) {
      Swal.fire('Error', 'Todos los campos del cliente y la fecha son obligatorios.', 'warning');
      return;
    }

    if (productosSeleccionados.length === 0) {
      Swal.fire('Error', 'Debes agregar al menos un producto a la cotización.', 'warning');
      return;
    }

    // Validar que los productos tengan cantidad y valor unitario
    for (const prod of productosSeleccionados) {
      if (!prod.producto || !prod.cantidad || !prod.valorUnitario) {
        Swal.fire('Error', 'Todos los productos deben cantidad y valor unitario.', 'warning');
        return;
      }
    }

    const clienteData = {
      nombre,
      ciudad,
      direccion,
      telefono,
      correo,
      esCliente: false
    };

    const datosCotizacion = {
      cliente: clienteData,
      ciudad,
      telefono,
      correo,
      responsable: user?.firstName,
      fecha: obtenerFechaLocal(fecha),
      descripcion: descripcionRef.current?.getContent({ format: 'html' }) || '',
      condicionesPago: condicionesPagoRef.current?.getContent({ format: 'html' }) || '',
      productos: productosSeleccionados.map(p => ({
        producto: p.producto,
        descripcion: p.descripcion,
        cantidad: parseFloat(p.cantidad || 0),
        valorUnitario: parseFloat(p.valorUnitario || 0),
        descuento: parseFloat(p.descuento || 0),
        valorTotal: parseFloat(p.valorTotal || 0)
      })),
      clientePotencial: true,
      enviadoCorreo: enviar
    };

    // Mostrar el modal de FormatoCotizacion
    setDatosFormato(datosCotizacion);
    setMostrarFormato(true);
  };
  // Función para guardar cotización desde el modal
  const guardarCotizacionDesdeModal = async () => {
    if (!datosFormato) return;
    const token = localStorage.getItem('token');
    try {
      const cotizacionResponse = await fetch('http://localhost:5000/api/cotizaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosFormato)
      });
      const cotizacionResult = await cotizacionResponse.json();
      if (!cotizacionResponse.ok) {
        Swal.fire('Error', cotizacionResult.message || 'No se pudo guardar la cotización.', 'error');
        return;
      }
      Swal.fire('Éxito', 'Cotización registrada correctamente.', 'success');
      setMostrarFormato(false);
      navigate('/ListaDeCotizaciones');
    } catch (error) {
      console.error('Error en la solicitud de cotización:', error);
      Swal.fire('Error', 'Error de red al guardar cotización.', 'error');
    }
  };

  

  const guardarCotizacionFinal = async () => {
    const token = localStorage.getItem('token');

    try {
      const clienteResponse = await fetch('http://localhost:5000/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosFormato.cliente)
      });

      const clienteResult = await clienteResponse.json();

      if (!clienteResponse.ok) {
        Swal.fire('Error', clienteResult.message || 'No se pudo guardar el cliente.', 'error');
        return;
      }

      const cotizacionResponse = await fetch('http://localhost:5000/api/cotizaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...datosFormato,
          cliente: clienteResult.data || clienteResult,
          clientePotencial: true,
          enviadoCorreo: true
        })
      });

      const cotizacionResult = await cotizacionResponse.json();

      if (!cotizacionResponse.ok) {
        Swal.fire('Error', cotizacionResult.message || 'No se pudo guardar la cotización.', 'error');
        return;
      }

      Swal.fire('Éxito', 'Cotización registrada correctamente.', 'success')
        .then(() => {
          navigate('/ListaDeCotizaciones'); // ✅ Redirige después del mensaje
        });

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
          <div className='encabezado-modulo'>
            <h3 className='titulo-profesional'>Registrar cotizacion</h3>
          </div>
          <br />
          <br />

          {/* FORMULARIO ORIGINAL A INSERTAR AQUÍ */}
          {/* ... tu formulario completo sigue aquí como ya está construido */}
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
                  <td><input id='cliente' type="text" className="cuadroTexto" placeholder="Nombre o razón social" /></td>
                  <td><input id='ciudad' type="text" className="cuadroTexto" placeholder="Ciudad" /></td>
                  <td><input id='direccion' type="text" className="cuadroTexto" placeholder="Dirección" /></td>
                  <td><input id='telefono' type="number" className="cuadroTexto" placeholder="Teléfono" /></td>
                  <td><input id='email' type="email" className="cuadroTexto" placeholder="Correo electrónico" /></td>
                  <td><span id='vendedor'>{user ? user.firstName : ''} {user ? user.surname : ''}</span></td>
                  <td><input id='fecha' type="date" className="cuadroTexto" /></td>
                </tr>
                
              </tbody>
            </table>
          </div>

          <br />
          <label className="labelDOCS">Descripción cotización</label>
          <br /><br />
          <Editor id='descripcion-cotizacion'
            onInit={(evt, editor) => (descripcionRef.current = editor)}
            apiKey="bjhw7gemroy70lt4bgmfvl29zid7pmrwyrtx944dmm4jq39w"
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
                  <th>Subtotal</th>
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
          <br /><br />
          <Editor id='condiciones-pago'
            onInit={(evt, editor) => (condicionesPagoRef.current = editor)}
            apiKey="bjhw7gemroy70lt4bgmfvl29zid7pmrwyrtx944dmm4jq39w"
            textareaName="Condiciones"
            init={{ height: 300, menubar: false }}
          />


          <div className="buttons">
            <button className="btn btn-primary-cancel" onClick={ handleCancelado}>Cancelar</button>
            <button className="btn btn-primary-guardar" onClick={() => handleGuardarCotizacion(false, true)}>Guardar</button>
            <button className="btn btn-primary-env">
              Guardar y Enviar
            </button>
          </div>

          {mostrarFormato && datosFormato && (
            <FormatoCotizacion
              datos={datosFormato}
              onClose={() => setMostrarFormato(false)}
              onGuardar={guardarCotizacionDesdeModal}
            />
          )}



        </div>
        <p className="text-sm text-gray-400 tracking-wide text-center">
          © 2025{" "}
          <span className="text-yellow-400 font-semibold transition duration-300 hover:text-yellow-300 hover:brightness-125">
            PANGEA
          </span>
          . Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}











