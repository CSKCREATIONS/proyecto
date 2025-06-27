import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [compra, setCompra] = useState({
    proveedor: '',
    producto: '',
    cantidad: '',
    precioUnitario: ''
  });

  // Obtener compras
  const obtenerCompras = () => {
    fetch('http://localhost:3000/api/compras')
      .then(res => res.json())
      .then(data => setCompras(data.data || []));
  };

  // Obtener proveedores y productos para el formulario
  useEffect(() => {
    fetch('http://localhost:3000/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(data.data || []));

    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data.data || []));

    obtenerCompras();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setCompra(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Éxito', 'Compra registrada correctamente', 'success');
        setMostrarModal(false);
        setCompra({ proveedor: '', producto: '', cantidad: '', precioUnitario: '' });
        obtenerCompras();
      } else {
        Swal.fire('Error', data.message || 'Error al guardar', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la compra', 'error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Compras</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setMostrarModal(true)}
      >
        Agregar Compra
      </button>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Proveedor</th>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Precio Unitario</th>
            <th className="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {compras.map(compra => (
            <tr key={compra._id}>
              <td className="border p-2">{compra.proveedor?.nombre}</td>
              <td className="border p-2">{compra.producto?.nombre}</td>
              <td className="border p-2">{compra.cantidad}</td>
              <td className="border p-2">${compra.precioUnitario.toLocaleString()}</td>
              <td className="border p-2">{new Date(compra.fechaCompra).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Registrar Compra</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="proveedor" className="w-full border rounded p-2" value={compra.proveedor} onChange={handleChange} required>
                <option value="">Seleccione proveedor</option>
                {proveedores.map(p => (
                  <option key={p._id} value={p._id}>{p.nombre}</option>
                ))}
              </select>
              <select name="producto" className="w-full border rounded p-2" value={compra.producto} onChange={handleChange} required>
                <option value="">Seleccione producto</option>
                {productos.map(p => (
                  <option key={p._id} value={p._id}>{p.nombre}</option>
                ))}
              </select>
              <input type="number" name="cantidad" className="w-full border rounded p-2" placeholder="Cantidad" value={compra.cantidad} onChange={handleChange} required />
              <input type="number" name="precioUnitario" className="w-full border rounded p-2" placeholder="Precio Unitario" value={compra.precioUnitario} onChange={handleChange} required />
              <div className="flex justify-between">
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;
