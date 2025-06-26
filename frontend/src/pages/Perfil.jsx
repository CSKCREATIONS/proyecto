import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fijo from '../components/Fijo';
import { openModal } from '../funciones/animaciones';
import EditarPerfil from '../components/EditarPerfil';
import Swal from 'sweetalert2';

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      localStorage.clear();

      await Swal.fire({
        title: '¡Sesión cerrada!',
        text: 'Has salido correctamente.',
        icon: 'success'
      });

      navigate('/Login');
    }
  };

  if (!user) return <div className='contenido-modulo'><p>Inicie sesion primero abeja</p></div>;

  return (
    <div>
      <Fijo />
      <div className="content">
        <div className='contenido-modulo'>
          <div className="header">
            <h1>{user.firstName} {user.surname}</h1>
            <button onClick={() => openModal('editar-perfil')} style={{ background: 'transparent', cursor: 'pointer' }}>◀ Editar</button>
          </div>

          <div className="containerPerfil">
            <div className="user-info">
              <div className="info-item"><strong>Nombre(s)</strong><p>{user.firstName} {user.secondName}</p></div>
              <div className="info-item"><strong>Apellidos</strong><p>{user.surname} {user.secondSurname}</p></div>
              <div className="info-item"><strong>Correo electrónico</strong><p>{user.email}</p></div>
              <div className="info-item"><strong>Nombre de usuario</strong><p>{user.username}</p></div>
              <div className="info-item"><strong>Rol</strong><p>{user.role}</p></div>

              <button className="btn btn-primary" onClick={handleClick}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditarPerfil />
    </div>
  );
}
