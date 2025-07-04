import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toggleSubMenu, closeModal } from '../funciones/animaciones';

export default function EditarPerfil() {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });

        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
          setForm({
            firstName: data.user.firstName,
            secondName: data.user.secondName,
            surname: data.user.surname,
            secondSurname: data.user.secondSurname,
            email: data.user.email,
            username: data.user.username,
            role: data.user.role
          });
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem('token');

    if (passwords.new && passwords.new !== passwords.confirm) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }

    try {
      // Actualizar datos del perfil (excepto contraseña)
      const res = await fetch(`http://localhost:5000/api/users/${userData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Error al actualizar los datos del perfil');

      // Cambiar la contraseña si se llenaron los campos
      if (passwords.new) {
        const resPass = await fetch(`http://localhost:5000/api/users/change-password`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({ newPassword: passwords.new })
        });

        // Actualizar localStorage con los nuevos datos
        const updatedUser = {
          ...userData,
          ...form // sobreescribe solo los campos modificados
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));


        const data = await resPass.json();
        if (!resPass.ok) throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      closeModal('editar-perfil');
      setPasswords({ new: '', confirm: '' });

    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };


  if (!form.firstName) return null;

  return (
    <div className="modal" id='editar-perfil'>
      <div className="form-group">
        <label>Primer nombre</label>
        <input className='entrada' type="text" name="firstName" value={form.firstName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Segundo nombre</label>
        <input className='entrada' type="text" name="secondName" value={form.secondName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Primer apellido</label>
        <input className='entrada' type="text" name="surname" value={form.surname} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Segundo apellido</label>
        <input className='entrada' type="text" name="secondSurname" value={form.secondSurname} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Rol</label>
        <input className='entrada' type="text" value={form.role} readOnly disabled />
      </div>
      <div className="form-group">
        <label>Correo</label>
        <input className='entrada' type="email" name="email" value={form.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Nombre de usuario</label>
        <input className='entrada' type="text" name="username" value={form.username} onChange={handleChange} />
      </div>

      <div className="buttons">
        <button className='btn btn-secondary' onClick={() => toggleSubMenu('changePassword')}>
          Cambiar contraseña
        </button>
      </div>

      <div className='dropdown' id='changePassword' style={{ border: '1px solid #ccc', padding: '0.5rem', marginTop: '1rem' }}>
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input className='entrada' type="password" name="new" value={passwords.new} onChange={handlePasswordChange} />
        </div>
        <div className="form-group">
          <label>Confirmar nueva contraseña</label>
          <input className='entrada' type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />
        </div>
      </div>

      <div className="buttons">
        <button className="btn btn-secondary" onClick={() => closeModal('editar-perfil')}>Cancelar</button>
        <button className="btn btn-primary" onClick={guardarCambios}>Guardar Cambios</button>
      </div>
    </div>
  );
}
