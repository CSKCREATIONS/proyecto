import React, { useState, useEffect } from 'react';
import { actualizarUsuario } from '../js/userService';
import Swal from 'sweetalert2';
import '../App.css'; // Asegúrate de tener las clases CSS necesarias

export default function EditarUsuario({ usuario, show, onHide, onActualizado }) {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'admin',
    enabled: true
  });

  useEffect(() => {
    if (usuario && show) {
      setForm({
        fullName: usuario.fullName || '',
        username: usuario.username || '',
        email: usuario.email || '',
        role: usuario.role || 'admin',
        enabled: usuario.enabled ?? true
      });
    }
  }, [usuario, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actualizarUsuario(usuario._id, form);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          timer: 1500,
          showConfirmButton: false
        });
        onActualizado();
        onHide();
      } else {
        Swal.fire('Error', res.message || 'No se pudo actualizar el usuario', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al actualizar el usuario', 'error');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-compact">
        <div className="modal-header">
          <h3 className="modal-title">Editar Usuario</h3>
          <button className="modal-close" onClick={onHide}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">Nombre completo</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">Usuario</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Nombre de usuario"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">Rol</label>
                <select
                  name="role"
                  className="form-input"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="auxiliar">Auxiliar</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label required">Correo</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@dominio.com"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={form.enabled}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Usuario habilitado
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onHide}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-save">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}