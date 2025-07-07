import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import Fijo from '../components/Fijo';
import NavProductos from '../components/NavProductos';

const API_URL = 'http://localhost:5000/api/subcategories';
const CATEGORY_API_URL = 'http://localhost:5000/api/categories';
const token = localStorage.getItem('token');

const SubcategoriaModal = ({ subcategoria, categorias, onClose, onSave }) => {
  const [name, setName] = useState(subcategoria?.name || '');
  const [description, setDescription] = useState(subcategoria?.description || '');
  const [categoryId, setCategoryId] = useState(subcategoria?.category?._id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !categoryId) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
      return;
    }
    onSave({ id: subcategoria?._id, name, description, categoryId });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-compact">
        <div className="modal-header">
          <h5 className="modal-title">
            {subcategoria ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
          </h5>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label required">Nombre</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label required">Descripción</label>
              <input className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label required">Categoría</label>
              <select
                id="category"
                className="form-select"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                    {cat.name}
                    </option>
                ))}
                </select>

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-save">{subcategoria ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestionSubcategorias = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [subcategoriaEditando, setSubcategoriaEditando] = useState(null);

  useEffect(() => {
    loadSubcategorias();
    loadCategorias();
  }, []);

  const loadSubcategorias = async () => {
  try {
    const res = await fetch(API_URL, {
      headers: { 'x-access-token': token }
    });

    const result = await res.json();
    
    // Normaliza la respuesta para que siempre sea un array
    const data = result.subcategories || result.data || result || [];
    
    setSubcategorias(Array.isArray(data) ? data : []);
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las subcategorías', 'error');
  }
};

const loadCategorias = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/categories', {
      headers: { 'x-access-token': token }
    });

    const result = await res.json();
    const data = result.categories || result.data || result || [];

    // Filtrar solo categorías activas
    const activas = Array.isArray(data) ? data.filter(cat => cat.activo) : [];

    setCategorias(activas);
  } catch (err) {
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
  }
};



  const handleSave = async ({ id, name, description, categoryId }) => {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ name, description, category: categoryId })
      });

      if (!res.ok) throw new Error('Error al guardar');
      Swal.fire('Éxito', id ? 'Subcategoría actualizada' : 'Subcategoría creada', 'success');
      setModalVisible(false);
      loadSubcategorias();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEdit = (subcat) => {
    setSubcategoriaEditando(subcat);
    setModalVisible(true);
  };

  
    const toggleEstadoSubcategoria = async (id, activar = false) => {
    const confirm = await Swal.fire({
      title: activar ? '¿Activar subcategoría?' : '¿Desactivar subcategoría?',
      text: activar ? 'Estará nuevamente disponible.' : 'Podrás volver a activarla más adelante.',
      icon: activar ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: activar ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    });
  
    if (!confirm.isConfirmed) return;
  
    try {
      const res = await fetch(`${API_URL}/${id}/${activar ? 'activate' : 'deactivate'}`, {
        method: 'PATCH',
        headers: { 'x-access-token': token }
      });
  
      if (!res.ok) throw new Error(`No se pudo ${activar ? 'activar' : 'desactivar'} la categoría`);
  
      await Swal.fire(
        activar ? 'Activada' : 'Desactivada',
        `La subcategoría ha sido ${activar ? 'activada' : 'desactivada'} correctamente.`,
        'success'
      );
  
      // ✅ IMPORTANTE: vuelve a cargar los datos actualizados
      await loadSubcategorias();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavProductos/>
        <div className="contenido-modulo">

            <div className='encabezado-modulo'>
            <h3>Gestion de subcategorias</h3>
          </div>
          <br />
            <br />
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-save" onClick={() => { setSubcategoriaEditando(null); setModalVisible(true); }}>
            + Nueva Subcategoría
          </button>
        </div>
        <br />
        <div className="table-conteiner">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subcategorias.map((subcat) => (
                <tr key={subcat._id}>
                  <td>{subcat.name}</td>
                  <td>{subcat.description}</td>
                  <td>{subcat.category?.name || 'Sin categoría'}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => handleEdit(subcat)} title="Editar">
                         <i className="fa-solid fa-pen"></i>  
                    </button>
                    &nbsp;&nbsp;
                   {subcat.activo ? (
                        <button
                        className="btn btn-warning btn-sm"
                        onClick={() => toggleEstadoSubcategoria(subcat._id, false)}
                        >
                        <i className="fa-solid fa-ban"></i> Inhabilitar
                        </button>
                    ) : (
                        <button
                        className="btn btn-success btn-sm"
                        onClick={() => toggleEstadoSubcategoria(subcat._id, true)}
                        >
                        <i className="fa-solid fa-check"></i> Habilitar
                        </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalVisible && (
          <SubcategoriaModal
            subcategoria={subcategoriaEditando}
            categorias={categorias}
            onClose={() => setModalVisible(false)}
            onSave={handleSave}
          />
        )}
        </div>
        
      </div>
    </div>
  );
};

export default GestionSubcategorias;
