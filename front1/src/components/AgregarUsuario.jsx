import React, { useState } from 'react';
import '../App.css';

export default function AgregarUsuario({ show, onHide, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    role: 'admin',
    password: '',
    enabled: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
    setFormData({ fullName: '', username: '', email: '', role: 'admin', password: '', enabled: true });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-compact">
        <div className="modal-header">
          <h3 className="modal-title">Agregar Usuario</h3>
          <button className="modal-close" onClick={onHide}>
            &times;
          </button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">Nombre completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Nombre de usuario"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="admin">Administrador</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="auxiliar">Auxiliar</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="ejemplo@dominio.com"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="form-label required">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Contraseña segura"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={formData.enabled}
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
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onHide}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-save"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}