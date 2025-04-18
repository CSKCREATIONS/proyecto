import React from 'react'
import { useNavigate } from 'react-router-dom';
import Fijo1 from '../components/Fijo1'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'
import Swal from 'sweetalert2'

export default function Perfil() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Aquí podrías limpiar el estado o el token, si lo usas
      // Por ejemplo: localStorage.clear();

      await Swal.fire({
        title: '¡Sesión cerrada!',
        text: 'Has salido correctamente.',
        icon: 'success'
      });

      navigate('/Login');
    }
  };

  return (
    <div>
      <Fijo1 />
      <div className="content">
        <div className='contenido-modulo'>
          <div className="header">
            <h1>Pepito Perez </h1>
            <button onClick={() => openModal('editUserModal')} style={{background:'transparent', cursor:'pointer'}}>◀ Editar</button>
          </div>

          <div className="containerPerfil">
            <div className="user-info">
              <div className="info-item"><strong>No documento</strong><p>1034567829</p></div>
              <div className="info-item"><strong>Nombre completo</strong><p>Pepito Pérez Camargo</p></div>
              <div className="info-item"><strong>No teléfono</strong><p>3034567829</p></div>
              <div className="info-item"><strong>Correo electrónico</strong><p>pepa@gmail.com</p></div>
              <div className="info-item"><strong>Nombre de usuario</strong><p>el pepe</p></div>
              <div className="info-item"><strong>Contraseña</strong><p>******</p></div>
              <div className="info-item"><strong>Rol</strong><p>SIG</p></div>
              
              <button className="btn btn-primary" onClick={handleClick}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditarUsuario />
    </div>
  );
}
