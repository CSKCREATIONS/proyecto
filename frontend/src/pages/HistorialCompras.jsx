// frontend/pages/HistorialCompras.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Fijo from '../components/Fijo';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';
import NavCompras from '../components/NavCompras'


export default function HistorialCompras() {
  const [compras, setCompras] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalObservacionesVisible, setModalObservacionesVisible] = useState(false);
  const [observacionesCompra, setObservacionesCompra] = useState('');
  const [modalProductosVisible, setModalProductosVisible] = useState(false);
  const [productosCompra, setProductosCompra] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [compra, setCompra] = useState({ proveedor: '', productos: [], observaciones: '', condicionesPago: '' });
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [editandoId, setEditandoId] = useState(null);


  const fetchCompras = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/compras', {
      headers: { 'x-access-token': token }
    });
    const data = await res.json();
    if (data.success) {
      setCompras(data.data);
    }
  };

  const editarCompra = (compraEdit) => {
    setCompra({
      proveedor: compraEdit.proveedor._id || compraEdit.proveedor,
      productos: compraEdit.productos.map(p => ({
        producto: p.producto,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      })),
      condicionesPago: compraEdit.condicionesPago || '',
      observaciones: compraEdit.observaciones || ''
    });
    setEditandoId(compraEdit._id);
    handleProveedorChange(compraEdit.proveedor._id || compraEdit.proveedor);
    setModalVisible(true);
  };

  const eliminarCompra = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará la compra permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/compras/${id}`, {
      method: 'DELETE',
      headers: { 'x-access-token': token }
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire('Eliminado', '', 'success');
      fetchCompras();
    } else {
      Swal.fire('Error', data.message || 'No se pudo eliminar', 'error');
    }
  };

  const fetchDatos = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'x-access-token': token };
    const [resProv, resProd] = await Promise.all([
      fetch('http://localhost:5000/api/proveedores', { headers }),
      fetch('http://localhost:5000/api/products', { headers })
    ]);
    const dataProv = await resProv.json();
    const dataProd = await resProd.json();
    setProveedores(dataProv.proveedores || dataProv.data || []);
    setProductos(dataProd.data || []);
  };

  useEffect(() => {
    fetchCompras();
    fetchDatos();
  }, []);

  const abrirObservacionesModal = (observaciones) => {
    setObservacionesCompra(observaciones);
    setModalObservacionesVisible(true);
  };

  const abrirProductosModal = (productos) => {
    setProductosCompra(productos);
    setModalProductosVisible(true);
  };

  const handleProveedorChange = (idProveedor) => {
    setCompra({ ...compra, proveedor: idProveedor, productos: [] });

    const filtrados = productos.filter(p => {
      const proveedorId = typeof p.proveedor === 'object' ? p.proveedor._id : p.proveedor;
      return proveedorId === idProveedor;
    });

    setProductosFiltrados(filtrados);
  };

  const agregarProducto = () => {
    if (!productoId || !cantidad) return;

    const productoSeleccionado = productos.find(p => p._id === productoId);
    if (!productoSeleccionado) return;

    const yaExiste = compra.productos.find(p => p.producto._id === productoId);
    if (yaExiste) return Swal.fire('Advertencia', 'Producto ya agregado', 'warning');

    const precioUnitario = parseFloat(productoSeleccionado.price || productoSeleccionado.precio);
    if (isNaN(precioUnitario)) {
      return Swal.fire('Error', 'Precio inválido para el producto seleccionado', 'error');
    }

    setCompra(prev => ({
      ...prev,
      productos: [...prev.productos, {
        producto: productoSeleccionado, // guardamos todo el objeto
        cantidad,
        precioUnitario
      }]
    }));

    setProductoId('');
    setCantidad(1);
  };

  const total = compra.productos.reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0);

  const guardarCompra = async () => {
  if (!compra.proveedor || compra.productos.length === 0) {
    return Swal.fire('Error', 'Completa todos los campos', 'error');
  }

  const token = localStorage.getItem('token');
  const metodo = editandoId ? 'PUT' : 'POST';
  const url = editandoId
    ? `http://localhost:5000/api/compras/${editandoId}`
    : 'http://localhost:5000/api/compras';

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', 'x-access-token': token },
    body: JSON.stringify({
      ...compra,
      productos: compra.productos.map(p => ({
        producto: p.producto._id || p.producto,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      })),
      total
    })
  });

  const data = await res.json();
  if (data.success) {
    Swal.fire('Éxito', editandoId ? 'Compra actualizada' : 'Compra registrada', 'success');
    fetchCompras();
    setModalVisible(false);
    setCompra({ proveedor: '', productos: [], condicionesPago: '', observaciones: '' });
    setProductosFiltrados([]);
    setEditandoId(null); // ✅ Importante: limpiar estado de edición
  } else {
    Swal.fire('Error', data.message || 'Error al guardar', 'error');
  }
};


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavCompras/>
        <div className="contenido-modulo">
          <EncabezadoModulo2 titulo="Historial de Compras" />
          <br />
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-save" onClick={() => setModalVisible(true)}>
              + Registrar Compra
            </button>
            <br />
            <br />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Proveedor</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Condiciones de Pago</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra, index) => (
                  <tr key={compra._id}>
                    <td>{index + 1}</td>
                    <td>{compra.proveedor?.nombre}</td>
                    <td>${compra.total.toLocaleString()}</td>
                    <td>{new Date(compra.fechaCompra || compra.fecha).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => abrirProductosModal(compra.productos)}
                        className="btn btn-info btn-sm"
                      >
                        Ver Productos
                      </button>
                    </td>
                    <td>{compra.condicionesPago || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => abrirObservacionesModal(compra.observaciones || '')}
                        className="btn btn-secondary btn-sm"
                      >
                        Ver Observaciones
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => editarCompra(compra)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarCompra(compra._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {compras.length === 0 && <p>No hay compras registradas.</p>}
          </div>

          {/* Modal observaciones */}
          {modalObservacionesVisible && (
            <div className="modal-overlay">
              <div className="modal-compact">
                <div className="modal-header">
                  <h5 className="modal-title">Observaciones</h5>
                  <button className="modal-close" onClick={() => setModalObservacionesVisible(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <p>{observacionesCompra || 'Sin observaciones'}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setModalObservacionesVisible(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal productos */}
          {modalProductosVisible && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5 className="modal-title">Productos de la Compra</h5>
                  <button className="modal-close" onClick={() => setModalProductosVisible(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <ul className="list-group">
                    {productosCompra.map((p, i) => (
                      <li key={i} className="list-group-item">
                        <strong>{p.producto?.name}</strong> – {p.cantidad} x ${p.precioUnitario}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setModalProductosVisible(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal registrar compra */}
          {modalVisible && (
            <div className="modal-overlay">
              <div className="modal-compact modal-lg">
                <div className="modal-header">
                  <h5 className="modal-title">{editandoId ? 'Editar Compra' : 'Registrar Compra'}</h5>
                  <button className="modal-close" onClick={() => setModalVisible(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Proveedor:</label>
                    <select value={compra.proveedor} onChange={(e) => handleProveedorChange(e.target.value)}>
                      <option value="">Seleccione proveedor</option>
                      {proveedores.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Producto:</label>
                    <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
                      <option value="">Seleccione producto</option>
                      {productosFiltrados.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <input type="number" value={cantidad} min="1" onChange={(e) => setCantidad(parseInt(e.target.value))} placeholder="Cantidad" />
                    <button className="btn btn-save btn-sm" type="button" onClick={agregarProducto}>+ Agregar</button>
                  </div>

                  <div>
                    <ul>
                      {compra.productos.map((p, i) => (
                        <li key={i}> {p.producto?.name} - Cant: {p.cantidad} - ${p.precioUnitario} </li>
                      ))}
                    </ul>
                  </div>

                  <div className="form-group">
                    <label>Condiciones de Pago:</label>
                    <textarea value={compra.condicionesPago} onChange={(e) => setCompra({ ...compra, condicionesPago: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea value={compra.observaciones} onChange={(e) => setCompra({ ...compra, observaciones: e.target.value })} />
                  </div>

                  <div className="form-group"><strong>Total:</strong> ${total.toLocaleString()}</div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setModalVisible(false)}>Cancelar</button>
                <button className="btn btn-save" onClick={guardarCompra}>
                  {editandoId ? 'Actualizar' : 'Guardar'}
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}