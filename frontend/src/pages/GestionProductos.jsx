import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Fijo from '../components/Fijo';
import NavProductos from '../components/NavProductos';

const API_PRODUCTS = 'http://localhost:3000/api/products';
const API_CATEGORIES = 'http://localhost:3000/api/categories';
const API_SUBCATEGORIES = 'http://localhost:3000/api/subcategories';
const API_PROVEEDORES = 'http://localhost:3000/api/proveedores';

const token = localStorage.getItem('token');

const ProductoModal = ({
  producto,
  onClose,
  onSave,
  categorias = [],
  subcategorias = [],
  proveedores = []
}) => {

  const [form, setForm] = useState({
    name: producto?.name || '',
    description: producto?.description || '',
    price: producto?.price || '',
    stock: producto?.stock || '',
    category: producto?.category?._id || producto?.category || '',
    subcategory: producto?.subcategory?._id || producto?.subcategory || '',
    proveedor: producto?.proveedor?._id || producto?.proveedor || ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(form).some(field => field === '')) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
      return;
    }
    onSave({ ...producto, ...form });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-compact modal-xl">
        <div className="modal-header">
          <h5 className="modal-title">{producto ? 'Editar Producto' : 'Agregar Producto'}</h5>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="form-input" required />
              <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="form-input" required />
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Precio" className="form-input" required />
              <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="form-input" required />
              <select name="category" value={form.category} onChange={handleChange} className="form-select" required>
                <option value="">Seleccione Categoría</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <select name="subcategory" value={form.subcategory} onChange={handleChange} className="form-select" required>
                <option value="">Seleccione Subcategoría</option>
                {subcategorias.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} {sub.category?.name ? `(${sub.category.name})` : ''}
                  </option>
                ))}
              </select>
              <select name="proveedor" value={form.proveedor} onChange={handleChange} className="form-select" required>
                <option value="">Seleccione Proveedor</option>
                {Array.isArray(proveedores) && proveedores.map(prov => (
                  <option key={prov._id} value={prov._id}>
                    {prov.nombre} ({prov.empresa || 'Sin empresa'})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const productosFiltrados = productos.filter(prod => {
    if (filtroEstado === 'activos') return prod.activo;
    if (filtroEstado === 'inactivos') return !prod.activo;
    return true;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado]);


  useEffect(() => {
    loadProductos();
    loadCategorias();
    loadSubcategorias();
  }, []);

  useEffect(() => {
  const fetchProveedores = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/proveedores/activos', {
        headers: { 'x-access-token': token }
      });

      const data = await res.json();
      setProveedores(data.proveedores); // o como los guardes
    } catch (error) {
      console.error('Error al cargar proveedores', error);
    }
  };

  fetchProveedores();
}, []);


  const loadProductos = async () => {
    try {
      const res = await fetch(API_PRODUCTS, { headers: { 'x-access-token': token } });
      const result = await res.json();
      const lista = result.products || result.data || result;
      setProductos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    }
  };

  const handleSave = async (producto) => {
    const url = producto._id ? `${API_PRODUCTS}/${producto._id}` : API_PRODUCTS;
    const method = producto._id ? 'PUT' : 'POST';

    const dataToSend = {
      ...producto,
      proveedor: typeof producto.proveedor === 'object' ? producto.proveedor._id : producto.proveedor,
      category: typeof producto.category === 'object' ? producto.category._id : producto.category,
      subcategory: typeof producto.subcategory === 'object' ? producto.subcategory._id : producto.subcategory
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) throw new Error('Error al guardar el producto');

      Swal.fire('Éxito', 'Producto guardado correctamente', 'success');
      setModalVisible(false);
      loadProductos();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEdit = producto => {
    setProductoEditando(producto);
    setModalVisible(true);
  };

  const handleToggleEstado = async (productoId, estadoActual) => {
    const accion = estadoActual ? 'deactivate' : 'activate';
    const url = `${API_PRODUCTS}/${productoId}/${accion}`;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'x-access-token': token
        }
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Éxito', `Producto ${accion === 'deactivate' ? 'desactivado' : 'activado'} correctamente`, 'success');
        loadProductos();
      } else {
        throw new Error(result.message || `No se pudo ${accion} el producto`);
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_PRODUCTS}/${id}`, {
          method: 'DELETE',
          headers: {
            'x-access-token': token
          }
        });

        if (!res.ok) throw new Error('Error al eliminar el producto');

        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
        loadProductos();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const loadCategorias = async () => {
    const res = await fetch(API_CATEGORIES, { headers: { 'x-access-token': token } });
    const result = await res.json();
    const data = result.categories || result.data || result;
    setCategorias(Array.isArray(data) ? data : []);
  };

  const loadSubcategorias = async () => {
    const res = await fetch(API_SUBCATEGORIES, { headers: { 'x-access-token': token } });
    const result = await res.json();
    const data = result.subcategories || result.data || result;
    setSubcategorias(Array.isArray(data) ? data : []);
  };

  

 
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavProductos />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <h3 className='titulo-profesional'>Gestion de productos</h3>
          </div>
          <br />
          <br />
          <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
            <button className="btn btn-save" onClick={() => {
              setProductoEditando(null);
              setModalVisible(true);
            }}>
              + Agregar Producto
            </button>
            &nbsp;
            &nbsp;
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                maxWidth: '200px',
                padding: '8px 15px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '14px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <br />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Subcategoría</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPaginados.map(prod => (
                  <tr key={prod._id}>
                    <td>{prod.name}</td>
                    <td>{prod.description}</td>
                    <td>{prod.price}</td>
                    <td>{prod.stock}</td>
                    <td>{prod.category?.name || '-'}</td>
                    <td>{prod.subcategory?.name || '-'}</td>
                    <td>{prod.proveedor?.nombre || '-'}</td>
                    <td>
                      <button className="btnTransparente" onClick={() => handleEdit(prod)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className={`btn btn-${prod.activo ? 'warning' : 'info'} btn-sm me-1`}
                        onClick={() => handleToggleEstado(prod._id, prod.activo)}
                      >
                        {prod.activo ? <i className="fa-solid fa-ban"></i> : <i className="fa-solid fa-check"></i>}
                      </button>
                      <button className="btnTransparente" onClick={() => handleDelete(prod._id)}>
                        <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && <tr><td colSpan="9">No hay productos disponibles</td></tr>}
              </tbody>

            </table>
          </div>
          {modalVisible && (
            <ProductoModal
              producto={productoEditando}
              onClose={() => setModalVisible(false)}
              onSave={handleSave}
              categorias={categorias || []}
              subcategorias={subcategorias || []}
              proveedores={proveedores || []}
                        />
          )}
          <div className="pagination">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => cambiarPagina(i + 1)}
                className={paginaActual === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
            
        </div>
        
      </div>
      <div className="custom-footer">
          <p className="custom-footer-text">
            © 2025 <span className="custom-highlight">PANGEA</span>. Todos los derechos reservados.
          </p>
        </div>
    </div>
  );
};

export default GestionProductos;
