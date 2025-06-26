import React, { useEffect, useState } from 'react';
import { toggleSubMenu, closeModal } from '../funciones/animaciones';
import Swal from 'sweetalert2';

export default function EditarUsuario({ usuario, fetchUsuarios }) {
  const [form, setForm] = useState({
    firstName: '',
    secondName: '',
    surname: '',
    secondSurname: '',
    role: '',
    email: '',
    username: '',
    enabled: true,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    if (usuario) {
      setForm({
        firstName: usuario.firstName,
        secondName: usuario.secondName,
        surname: usuario.surname,
        secondSurname: usuario.secondSurname,
        role: usuario.role,
        email: usuario.email,
        username: usuario.username,
        enabled: usuario.enabled,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${usuario._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Error al actualizar el usuario');

      let nuevaContrasena = null;

      // Si se quiere cambiar la contraseña
      if (passwords.new && passwords.confirm && passwords.new === passwords.confirm) {
        const resPassword = await fetch(`http://localhost:5000/api/users/${usuario._id}/change-password`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword: passwords.new
          })
        });

        const data = await resPassword.json();
        if (!resPassword.ok) throw new Error(data.message || 'Error al cambiar la contraseña');

        nuevaContrasena = passwords.new;
      }

      await fetchUsuarios();
      closeModal('editUserModal');
      setPasswords({ current: '', new: '', confirm: '' });

      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        html: nuevaContrasena ? `<p>Contraseña actualizada:<br><b>${nuevaContrasena}</b></p>` : '',
        timer: 2500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="modal" id="editUserModal">
      <div className="modal-content">
        {['firstName', 'secondName', 'surname', 'secondSurname', 'email', 'username'].map(campo => (
          <div className="form-group" key={campo}>
            <label>{campo.replace(/([A-Z])/g, ' $1')}</label>
            <input className='entrada' type="text" name={campo} value={form[campo] || ''} onChange={handleChange} />
          </div>
        ))}

        <div className="form-group">
          <label>Rol</label>
          <select className='entrada' name="role" value={form.role} onChange={handleChange}>
            <option value="admin">admin</option>
            <option value="gerente">Gerente general</option>
          </select>
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select className='entrada' name="enabled" value={form.enabled} onChange={(e) => setForm({...form, enabled: e.target.value === 'true'})}>
            <option value="true">Habilitado</option>
            <option value="false">Inhabilitado</option>
          </select>
        </div>

        <div className="buttons">
          <button className='btn btn-secondary' onClick={() => toggleSubMenu('changePassword')}>Cambiar contraseña</button>
        </div>

        <div className='dropdown' id='changePassword' style={{ border: '1px solid #ccc', padding: '0.5rem', marginTop: '1rem' }}>
          <div className="form-group"><label>Nueva contraseña</label><input className='entrada' type="password" name="new" value={passwords.new} onChange={handlePasswordChange} /></div>
          <div className="form-group"><label>Confirmar contraseña</label><input className='entrada' type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} /></div>
        </div>

        <div className="buttons">
          <button className="btn btn-secondary" onClick={() => closeModal('editUserModal')}>Cancelar</button>
          <button className="btn btn-primary" onClick={guardarCambios}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
