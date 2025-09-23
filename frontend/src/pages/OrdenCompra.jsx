import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Fijo from '../components/Fijo';
import NavCompras from '../components/NavCompras';

export default function OrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  
  const [nuevaOrden, setNuevaOrden] = useState({
    productos: [],
    condicionesPago: "Contado",
    estado: 'Pendiente',
    solicitadoPor: '',
    proveedor: ''
  });

  const [ordenEditando, setOrdenEditando] = useState({
    _id: '',
    productos: [],
    condicionesPago: "Contado",
    estado: 'Pendiente',
    solicitadoPor: '',
    proveedor: '',
    proveedorId: ''
  });

  const [productoTemp, setProductoTemp] = useState({
    producto: '',
    descripcion: '',
    cantidad: 1,
    valorUnitario: 0,
    descuento: 0
  });

  const [productoEditando, setProductoEditando] = useState({
    producto: '',
    descripcion: '',
    cantidad: 1,
    valorUnitario: 0,
    descuento: 0,
    index: null
  });

  // Función para obtener órdenes de compra
  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ordenes-compra', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrdenes(data.data || data);
      else Swal.fire('Error', data.message || 'No se pudieron cargar las órdenes', 'error');
    } catch {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  // Función para obtener proveedores
  const fetchProveedores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/proveedores', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        }
      });

      const data = await res.json();

      if (data.success) {
        setProveedores(data.data || data.proveedores || data);
      } else if (data.proveedores) {
        setProveedores(data.proveedores);
      } else {
        console.error('Formato de respuesta inesperado:', data);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  // Función para obtener productos de un proveedor específico
  const fetchProductosPorProveedor = async (proveedorId) => {
    if (!proveedorId) {
      setProductosProveedor([]);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/proveedores/${proveedorId}/productos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        }
      });

      const data = await res.json();

      if (data.success) {
        setProductosProveedor(data.data || data.productos || []);
      } else if (data.productos) {
        setProductosProveedor(data.productos);
      } else {
        setProductosProveedor([]);
        console.error('No se pudieron cargar los productos del proveedor:', data.message);
      }
    } catch (error) {
      console.error('Error al cargar productos del proveedor:', error);
      setProductosProveedor([]);
    }
  };

  useEffect(() => {
    fetchOrdenes();
    fetchProveedores();
  }, []);

  // Obtener órdenes pendientes para mostrar en la tabla
  const ordenesPendientes = ordenes.filter(orden => orden.estado === 'Pendiente');

  // Cuando se selecciona un proveedor en AGREGAR, cargar sus productos
  const handleProveedorChange = async (e) => {
    const proveedorId = e.target.value;
    const proveedorSeleccionado = proveedores.find(p => p._id === proveedorId);

    setNuevaOrden({
      ...nuevaOrden,
      proveedor: proveedorSeleccionado ? proveedorSeleccionado.nombre : '',
      productos: [] // Limpiar productos al cambiar proveedor
    });

    setProductoTemp({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0
    });

    await fetchProductosPorProveedor(proveedorId);
  };

  // Cuando se selecciona un proveedor en EDITAR, cargar sus productos
  const handleProveedorChangeEditar = async (e) => {
    const proveedorId = e.target.value;
    const proveedorSeleccionado = proveedores.find(p => p._id === proveedorId);

    setOrdenEditando({
      ...ordenEditando,
      proveedor: proveedorSeleccionado ? proveedorSeleccionado.nombre : '',
      proveedorId: proveedorId
    });

    await fetchProductosPorProveedor(proveedorId);
  };

  // Cuando se selecciona un producto del proveedor, autocompletar información (AGREGAR)
  const handleProductoChange = (e) => {
    const productoId = e.target.value;
    const productoSeleccionado = productosProveedor.find(p => p._id === productoId);

    if (productoSeleccionado) {
      setProductoTemp({
        ...productoTemp,
        producto: productoSeleccionado.name || productoSeleccionado.nombre,
        descripcion: productoSeleccionado.description || productoSeleccionado.descripcion || '',
        valorUnitario: productoSeleccionado.price || productoSeleccionado.precio || 0
      });
    }
  };

  // Cuando se selecciona un producto del proveedor, autocompletar información (EDITAR)
  const handleProductoChangeEditar = (e) => {
    const productoId = e.target.value;
    const productoSeleccionado = productosProveedor.find(p => p._id === productoId);

    if (productoSeleccionado) {
      setProductoTemp({
        ...productoTemp,
        producto: productoSeleccionado.name || productoSeleccionado.nombre,
        descripcion: productoSeleccionado.description || productoSeleccionado.descripcion || '',
        valorUnitario: productoSeleccionado.price || productoSeleccionado.precio || 0
      });
    }
  };

  const verDetallesOrden = (orden) => {
    setOrdenSeleccionada(orden);
    setModalDetallesVisible(true);
  };

  const abrirModalEditar = async (orden) => {
    // Buscar el ID del proveedor basado en el nombre
    const proveedorEncontrado = proveedores.find(p => p.nombre === orden.proveedor);
    
    setOrdenEditando({
      _id: orden._id,
      numeroOrden: orden.numeroOrden,
      productos: orden.productos ? [...orden.productos] : [],
      condicionesPago: orden.condicionesPago || "Contado",
      estado: orden.estado || 'Pendiente',
      solicitadoPor: orden.solicitadoPor || '',
      proveedor: orden.proveedor || '',
      proveedorId: proveedorEncontrado ? proveedorEncontrado._id : ''
    });

    // Cargar productos del proveedor si existe
    if (proveedorEncontrado) {
      await fetchProductosPorProveedor(proveedorEncontrado._id);
    }

    setModalEditarVisible(true);
  };

  const eliminarOrden = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará la orden permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/ordenes-compra/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Eliminado', 'La orden ha sido eliminada correctamente', 'success');
        fetchOrdenes();
      } else {
        Swal.fire('Error', data.message || 'No se pudo eliminar', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  // Función para marcar orden como completada con SweetAlert2
  const marcarComoCompletada = async (orden) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción completará la orden ${orden.numeroOrden} y creará una compra en el sistema.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545'
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const totales = calcularTotalesOrden(orden.productos);

      const compraData = {
        numeroOrden: orden.numeroOrden,
        proveedor: orden.proveedor?._id || orden.proveedor,
        productos: orden.productos.map(p => ({
          producto: p.producto?._id || p.producto,
          descripcion: p.descripcion,
          cantidad: p.cantidad,
          precioUnitario: p.valorUnitario || p.precioUnitario
        })),
        condicionesPago: orden.condicionesPago,
        subtotal: totales.subtotal,
        impuestos: totales.impuestos,
        total: totales.total,
        solicitadoPor: orden.solicitadoPor,
        _fromOrden: true
      };

      const res = await fetch('http://localhost:5000/api/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(compraData)
      });

      const data = await res.json();

      if (data.success) {
        await fetch(`http://localhost:5000/api/ordenes-compra/${orden._id}/completar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        Swal.fire('¡Éxito!', 'Orden de compra completada y movida al historial', 'success');
        fetchOrdenes();
      } else {
        Swal.fire('Error', data.message || 'No se pudo completar la orden', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  const abrirModalAgregar = () => {
    setModalAgregarVisible(true);
    setNuevaOrden({
      productos: [],
      condicionesPago: "Contado",
      estado: 'Pendiente',
      solicitadoPor: '',
      proveedor: ''
    });
    setProductoTemp({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0
    });
    setProductosProveedor([]);
  };

  const calcularValorTotalProducto = (p) => {
    const subtotal = p.cantidad * p.valorUnitario;
    const descuento = p.descuento || 0;
    return subtotal - descuento;
  };

  const agregarProducto = () => {
    if (!productoTemp.producto || productoTemp.cantidad < 1 || productoTemp.valorUnitario < 0) {
      Swal.fire('Error', 'Los campos Producto, Cantidad y Valor Unitario son obligatorios y no pueden ser negativos.', 'error');
      return;
    }

    const valorTotal = calcularValorTotalProducto(productoTemp);
    const nuevoProducto = {
      producto: productoTemp.producto,
      descripcion: productoTemp.descripcion,
      cantidad: productoTemp.cantidad,
      valorUnitario: productoTemp.valorUnitario,
      descuento: productoTemp.descuento,
      valorTotal: valorTotal
    };

    setNuevaOrden({
      ...nuevaOrden,
      productos: [...nuevaOrden.productos, nuevoProducto]
    });

    setProductoTemp({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0
    });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = [...nuevaOrden.productos];
    nuevosProductos.splice(index, 1);
    setNuevaOrden({ ...nuevaOrden, productos: nuevosProductos });
  };

  // Funciones para editar productos
  const editarProducto = (index) => {
    const producto = ordenEditando.productos[index];
    setProductoEditando({
      ...producto,
      index: index
    });
  };

  const actualizarProducto = () => {
    if (!productoEditando.producto || productoEditando.cantidad < 1 || productoEditando.valorUnitario < 0) {
      Swal.fire('Error', 'Los campos Producto, Cantidad y Valor Unitario son obligatorios y no pueden ser negativos.', 'error');
      return;
    }

    const valorTotal = calcularValorTotalProducto(productoEditando);
    const productoActualizado = {
      producto: productoEditando.producto,
      descripcion: productoEditando.descripcion,
      cantidad: productoEditando.cantidad,
      valorUnitario: productoEditando.valorUnitario,
      descuento: productoEditando.descuento,
      valorTotal: valorTotal
    };

    const nuevosProductos = [...ordenEditando.productos];
    nuevosProductos[productoEditando.index] = productoActualizado;

    setOrdenEditando({
      ...ordenEditando,
      productos: nuevosProductos
    });

    setProductoEditando({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0,
      index: null
    });
  };

  const eliminarProductoEdicion = (index) => {
    const nuevosProductos = ordenEditando.productos.filter((_, i) => i !== index);
    setOrdenEditando({
      ...ordenEditando,
      productos: nuevosProductos
    });
  };

  const agregarProductoEdicion = () => {
    if (!productoTemp.producto || productoTemp.cantidad < 1 || productoTemp.valorUnitario < 0) {
      Swal.fire('Error', 'Los campos Producto, Cantidad y Valor Unitario son obligatorios y no pueden ser negativos.', 'error');
      return;
    }

    const valorTotal = calcularValorTotalProducto(productoTemp);
    const nuevoProducto = {
      producto: productoTemp.producto,
      descripcion: productoTemp.descripcion,
      cantidad: productoTemp.cantidad,
      valorUnitario: productoTemp.valorUnitario,
      descuento: productoTemp.descuento,
      valorTotal: valorTotal
    };

    setOrdenEditando({
      ...ordenEditando,
      productos: [...ordenEditando.productos, nuevoProducto]
    });

    setProductoTemp({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0
    });
  };

  // Función para calcular totales (genérica)
  const calcularTotales = (productos) => {
    const subtotal = productos.reduce((acc, p) => acc + (p.valorTotal || 0), 0);
    const impuestos = subtotal * 0.19;
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
  };

  // Función específica para orden existente
  const calcularTotalesOrden = (productos) => {
    const subtotal = productos.reduce((acc, p) => {
      const valorProducto = (p.cantidad || 0) * (p.valorUnitario || p.precioUnitario || 0);
      const descuento = p.descuento || 0;
      return acc + (valorProducto - descuento);
    }, 0);
    const impuestos = subtotal * 0.19;
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
  };

  const guardarOrden = async () => {
    if (nuevaOrden.productos.length === 0) {
      Swal.fire('Error', 'Debes agregar al menos un producto.', 'error');
      return;
    }

    if (!nuevaOrden.solicitadoPor) {
      Swal.fire('Error', 'Debes ingresar quién solicita la orden.', 'error');
      return;
    }

    if (!nuevaOrden.proveedor) {
      Swal.fire('Error', 'Debes seleccionar un proveedor.', 'error');
      return;
    }

    const { subtotal, impuestos, total } = calcularTotales(nuevaOrden.productos);

    const ordenCompleta = {
      numeroOrden: `OC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      proveedor: nuevaOrden.proveedor,
      productos: nuevaOrden.productos,
      subtotal: subtotal,
      impuestos: impuestos,
      total: total,
      condicionesPago: nuevaOrden.condicionesPago,
      estado: nuevaOrden.estado,
      solicitadoPor: nuevaOrden.solicitadoPor,
      fechaOrden: new Date()
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ordenes-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ordenCompleta)
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire('¡Éxito!', 'Orden de compra creada correctamente', 'success');
        cerrarModalAgregar();
        fetchOrdenes();
      } else {
        Swal.fire('Error', data.message || 'No se pudo crear la orden', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  const actualizarOrden = async () => {
    if (ordenEditando.productos.length === 0) {
      Swal.fire('Error', 'Debe haber al menos un producto en la orden.', 'error');
      return;
    }

    if (!ordenEditando.solicitadoPor) {
      Swal.fire('Error', 'Debes ingresar quién solicita la orden.', 'error');
      return;
    }

    if (!ordenEditando.proveedor) {
      Swal.fire('Error', 'Debes seleccionar un proveedor.', 'error');
      return;
    }

    const { subtotal, impuestos, total } = calcularTotales(ordenEditando.productos);

    const ordenActualizada = {
      proveedor: ordenEditando.proveedor,
      productos: ordenEditando.productos,
      subtotal: subtotal,
      impuestos: impuestos,
      total: total,
      condicionesPago: ordenEditando.condicionesPago,
      estado: ordenEditando.estado,
      solicitadoPor: ordenEditando.solicitadoPor
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/ordenes-compra/${ordenEditando._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ordenActualizada)
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire('¡Éxito!', 'Orden de compra actualizada correctamente', 'success');
        cerrarModalEditar();
        fetchOrdenes();
      } else {
        Swal.fire('Error', data.message || 'No se pudo actualizar la orden', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  const cerrarModalAgregar = () => {
    setModalAgregarVisible(false);
    setNuevaOrden({
      productos: [],
      condicionesPago: "Contado",
      estado: 'Pendiente',
      solicitadoPor: '',
      proveedor: ''
    });
    setProductoTemp({ producto: '', descripcion: '', cantidad: 1, valorUnitario: 0, descuento: 0 });
    setProductosProveedor([]);
  };

  const cerrarModalEditar = () => {
    setModalEditarVisible(false);
    setOrdenEditando({
      _id: '',
      productos: [],
      condicionesPago: "Contado",
      estado: 'Pendiente',
      solicitadoPor: '',
      proveedor: '',
      proveedorId: ''
    });
    setProductoEditando({
      producto: '',
      descripcion: '',
      cantidad: 1,
      valorUnitario: 0,
      descuento: 0,
      index: null
    });
    setProductosProveedor([]);
  };

  const cerrarModalDetalles = () => {
    setModalDetallesVisible(false);
    setOrdenSeleccionada(null);
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavCompras />
        <div className="contenido-modulo">
          <h3 className='titulo-profesional'>Órdenes de Compra</h3>
          <br />
          <button className="btn btn-success" onClick={abrirModalAgregar}>Agregar Orden de Compra</button>
          <br /><br />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Número Orden</th>
                  <th>Proveedor</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Solicitado Por</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesPendientes.map((orden, index) => (
                  <tr key={orden._id}>
                    <td>{index + 1}</td>
                    <td>
                      <button
                        onClick={() => verDetallesOrden(orden)}
                        className="btn btn-link btn-sm p-0"
                        style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}
                      >
                        {orden.numeroOrden}
                      </button>
                    </td>
                    <td>{orden.proveedor || 'No especificado'}</td>
                    <td>${orden.total?.toLocaleString()}</td>
                    <td>{new Date(orden.fechaOrden).toLocaleDateString()}</td>
                    <td>{orden.solicitadoPor || 'No especificado'}</td>
                    <td>
                      {orden.estado === 'Pendiente' ? (
                        <button
                          onClick={() => marcarComoCompletada(orden)}
                          className="btn btn-warning btn-sm"
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Pendiente
                        </button>
                      ) : (
                        <span className={`badge ${orden.estado === 'Completada' ? 'bg-success' : 'bg-danger'}`}>
                          {orden.estado}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => abrirModalEditar(orden)}
                        className="btnTransparente"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className='btnTransparente'
                        onClick={() => eliminarOrden(orden._id)}
                      >
                        <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {ordenesPendientes.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center">No hay órdenes pendientes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal para agregar nueva orden */}
          {modalAgregarVisible && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5>Nueva Orden de Compra</h5>
                  <button className="modal-close" onClick={cerrarModalAgregar}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Proveedor *</label>
                    <select
                      value={proveedores.find(p => p.nombre === nuevaOrden.proveedor)?._id || ''}
                      onChange={handleProveedorChange}
                      required
                      className="form-input"
                    >
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor._id} value={proveedor._id}>
                          {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Solicitado Por *</label>
                    <input
                      type="text"
                      value={nuevaOrden.solicitadoPor}
                      onChange={e => setNuevaOrden({ ...nuevaOrden, solicitadoPor: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Nombre de quien solicita la orden"
                    />
                  </div>

                  <h6>Agregar producto</h6>

                  {productosProveedor.length > 0 && (
                    <div className="mb-3">
                      <label>Seleccionar producto del proveedor</label>
                      <select
                        value={productosProveedor.find(p => p.name === productoTemp.producto)?._id || ''}
                        onChange={handleProductoChange}
                        className="form-input"
                      >
                        <option value="">Seleccione un producto</option>
                        {productosProveedor.map(producto => (
                          <option key={producto._id} value={producto._id}>
                            {producto.name || producto.nombre} - ${producto.price || producto.precio}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label>Producto *</label>
                      <input
                        value={productoTemp.producto}
                        onChange={e => setProductoTemp({ ...productoTemp, producto: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div>
                      <label>Descripción</label>
                      <input
                        value={productoTemp.descripcion}
                        onChange={e => setProductoTemp({ ...productoTemp, descripcion: e.target.value })}
                        className="form-input"
                        placeholder="Descripción del producto"
                      />
                    </div>
                    <div>
                      <label>Cantidad *</label>
                      <input
                        type="number"
                        min="1"
                        value={productoTemp.cantidad}
                        onChange={e => setProductoTemp({ ...productoTemp, cantidad: Number(e.target.value) })}
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label>Valor Unitario *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productoTemp.valorUnitario}
                        onChange={e => setProductoTemp({ ...productoTemp, valorUnitario: Number(e.target.value) })}
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label>Descuento</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productoTemp.descuento}
                        onChange={e => setProductoTemp({ ...productoTemp, descuento: Number(e.target.value) })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button className="btn btn-info btn-sm" onClick={agregarProducto}>
                    Agregar producto
                  </button>

                  {nuevaOrden.productos.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h6>Productos agregados:</h6>
                      <div className="table-responsive">
                        <table className="table" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Descripción</th>
                              <th>Cantidad</th>
                              <th>Valor Unit.</th>
                              <th>Descuento</th>
                              <th>Total</th>
                              <th>Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {nuevaOrden.productos.map((p, i) => (
                              <tr key={i}>
                                <td>{p.producto}</td>
                                <td>{p.descripcion || 'N/A'}</td>
                                <td>{p.cantidad}</td>
                                <td>${p.valorUnitario.toLocaleString()}</td>
                                <td>${p.descuento.toLocaleString()}</td>
                                <td>${p.valorTotal.toLocaleString()}</td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => eliminarProducto(i)}
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <strong>Subtotal: ${calcularTotales(nuevaOrden.productos).subtotal.toLocaleString()}</strong><br />
                      <strong>IVA (19%): ${calcularTotales(nuevaOrden.productos).impuestos.toLocaleString()}</strong><br />
                      <strong>Total: ${calcularTotales(nuevaOrden.productos).total.toLocaleString()}</strong>
                    </div>
                    <div>
                      <button className="btn btn-success" onClick={guardarOrden}>
                        Guardar Orden
                      </button>
                      <button className="btn btn-cancel" onClick={cerrarModalAgregar} style={{ marginLeft: '0.5rem' }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para editar orden */}
          {modalEditarVisible && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5>Editar Orden de Compra: {ordenEditando.numeroOrden}</h5>
                  <button className="modal-close" onClick={cerrarModalEditar}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Proveedor *</label>
                    <select
                      value={ordenEditando.proveedorId}
                      onChange={handleProveedorChangeEditar}
                      required
                      className="form-input"
                    >
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor._id} value={proveedor._id}>
                          {proveedor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Solicitado Por *</label>
                    <input
                      type="text"
                      value={ordenEditando.solicitadoPor}
                      onChange={e => setOrdenEditando({ ...ordenEditando, solicitadoPor: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Nombre de quien solicita la orden"
                    />
                  </div>

                  <div className="mb-3">
                    <label>Condiciones de Pago</label>
                    <select
                      value={ordenEditando.condicionesPago}
                      onChange={e => setOrdenEditando({ ...ordenEditando, condicionesPago: e.target.value })}
                      className="form-input"
                    >
                      <option value="Contado">Contado</option>
                      <option value="Crédito 15 días">Crédito 15 días</option>
                      <option value="Crédito 30 días">Crédito 30 días</option>
                      <option value="Crédito 60 días">Crédito 60 días</option>
                    </select>
                  </div>

                  <h6>Productos de la orden</h6>

                  {/* Edición de producto existente */}
                  {productoEditando.index !== null && (
                    <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                      <h6>Editando Producto</h6>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label>Producto *</label>
                          <input
                            value={productoEditando.producto}
                            onChange={e => setProductoEditando({ ...productoEditando, producto: e.target.value })}
                            required
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label>Descripción</label>
                          <input
                            value={productoEditando.descripcion}
                            onChange={e => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label>Cantidad *</label>
                          <input
                            type="number"
                            min="1"
                            value={productoEditando.cantidad}
                            onChange={e => setProductoEditando({ ...productoEditando, cantidad: Number(e.target.value) })}
                            required
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label>Valor Unitario *</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productoEditando.valorUnitario}
                            onChange={e => setProductoEditando({ ...productoEditando, valorUnitario: Number(e.target.value) })}
                            required
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label>Descuento</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productoEditando.descuento}
                            onChange={e => setProductoEditando({ ...productoEditando, descuento: Number(e.target.value) })}
                            className="form-input"
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem' }}>
                        <button className="btn btn-success btn-sm" onClick={actualizarProducto}>
                          Actualizar Producto
                        </button>
                        <button 
                          className="btn btn-cancel btn-sm" 
                          onClick={() => setProductoEditando({ producto: '', descripcion: '', cantidad: 1, valorUnitario: 0, descuento: 0, index: null })}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de productos existentes */}
                  {ordenEditando.productos.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table" style={{ width: '100%' }}>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Valor Unit.</th>
                            <th>Descuento</th>
                            <th>Total</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenEditando.productos.map((p, i) => (
                            <tr key={i}>
                              <td>{p.producto}</td>
                              <td>{p.descripcion || 'N/A'}</td>
                              <td>{p.cantidad}</td>
                              <td>${p.valorUnitario?.toLocaleString()}</td>
                              <td>${p.descuento?.toLocaleString() || '0'}</td>
                              <td>${p.valorTotal?.toLocaleString()}</td>
                              <td>
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => editarProducto(i)}
                                  style={{ marginRight: '0.5rem' }}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => eliminarProductoEdicion(i)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No hay productos en esta orden.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <strong>Subtotal: ${calcularTotales(ordenEditando.productos).subtotal.toLocaleString()}</strong><br />
                      <strong>IVA (19%): ${calcularTotales(ordenEditando.productos).impuestos.toLocaleString()}</strong><br />
                      <strong>Total: ${calcularTotales(ordenEditando.productos).total.toLocaleString()}</strong>
                    </div>
                    <div>
                      <button className="btn btn-success" onClick={actualizarOrden}>
                        Actualizar Orden
                      </button>
                      <button className="btn btn-cancel" onClick={cerrarModalEditar} style={{ marginLeft: '0.5rem' }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de detalles */}
          {modalDetallesVisible && ordenSeleccionada && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5>Detalles de la Orden: {ordenSeleccionada.numeroOrden}</h5>
                  <button className="modal-close" onClick={cerrarModalDetalles}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Proveedor:</strong> {ordenSeleccionada.proveedor || 'No especificado'}
                    </div>
                    <div className="col-md-6">
                      <strong>Fecha:</strong> {new Date(ordenSeleccionada.fechaOrden).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Estado:</strong>
                      <span className={`badge ${ordenSeleccionada.estado === 'Pendiente' ? 'bg-warning' : ordenSeleccionada.estado === 'Completada' ? 'bg-success' : 'bg-danger'}`}>
                        {ordenSeleccionada.estado}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong>Solicitado Por:</strong> {ordenSeleccionada.solicitadoPor || 'No especificado'}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Subtotal:</strong> ${ordenSeleccionada.subtotal?.toLocaleString()}
                    </div>
                    <div className="col-md-4">
                      <strong>IVA (19%):</strong> ${ordenSeleccionada.impuestos?.toLocaleString()}
                    </div>
                    <div className="col-md-4">
                      <strong>Total:</strong> ${ordenSeleccionada.total?.toLocaleString()}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <strong>Condiciones de Pago:</strong> {ordenSeleccionada.condicionesPago}
                    </div>
                  </div>

                  <h6>Productos:</h6>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Valor Unitario</th>
                          <th>Descuento</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenSeleccionada.productos && ordenSeleccionada.productos.map((p, i) => (
                          <tr key={i}>
                            <td>{p.producto}</td>
                            <td>{p.descripcion || 'N/A'}</td>
                            <td>{p.cantidad}</td>
                            <td>${p.valorUnitario?.toLocaleString()}</td>
                            <td>${p.descuento?.toLocaleString() || '0'}</td>
                            <td>${p.valorTotal?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={cerrarModalDetalles}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <div className="custom-footer">
          <p className="custom-footer-text">
            © 2025 <span className="custom-highlight">PANGEA</span>. Todos los derechos reservados.
          </p>
        </div>
    </div>
  );
}