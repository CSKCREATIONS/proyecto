import React, { useEffect, useState } from 'react';
import Fijo from '../components/Fijo';
import AgregarUsuario from '../components/AgregarUsuario';
import NavUsuarios from '../components/NavUsuarios';
import { openModal } from '../funciones/animaciones';
import EditarUsuario from '../components/EditarUsuario';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = 'http://localhost:3000/api/users';
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'x-access-token': token
};

const exportarPDF = () => {
  const input = document.getElementById('tabla_lista_usuarios');
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('listaUsuarios.pdf');
  });
};

const exportToExcel = () => {
  const table = document.getElementById('tabla_lista_usuarios');
  if (!table) return;
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'ListaUsuarios.xlsx');
};

export default function ListaDeUsuarios() {
  const [users, setUsers] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const loadUsers = async () => {
    try {
      const response = await fetch(API_URL, { headers });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setUsers(result.data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      Swal.fire('Error', err.message, 'error');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAgregarUsuario = async (nuevoUsuario) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(nuevoUsuario)
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      Swal.fire('Éxito', 'Usuario agregado correctamente', 'success');
      setMostrarModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      Swal.fire('Error', error.message || 'No se pudo crear el usuario', 'error');
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const confirmResult = await Swal.fire({
      title: `¿Estás seguro de ${newStatus ? 'habilitar' : 'inhabilitar'} este usuario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ enabled: newStatus })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      Swal.fire('Éxito', `Usuario ${newStatus ? 'habilitado' : 'inhabilitado'} correctamente`, 'success');
      loadUsers();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };
const [mostrarEditar, setMostrarEditar] = useState(false);
const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

const handleEliminarUsuario = async (id) => {
  const confirmResult = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el usuario permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmResult.isConfirmed) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });

    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
    loadUsers(); // recarga la tabla
  } catch (error) {
    Swal.fire('Error', error.message || 'No se pudo eliminar el usuario', 'error');
  }
};



  return (
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3>Lista de usuarios</h3>
              <button className="btn btn-outline-success btn-sm me-2" onClick={exportToExcel}>
                <i className="fa-solid fa-file-excel"></i> Exportar a Excel
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={exportarPDF}>
                <i className="fa-solid fa-file-pdf"></i> Exportar a PDF
              </button>
            </div>
            <button className="btn btn-success" onClick={() => setMostrarModal(true)}>+ Nuevo Usuario</button>
          </div>

          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_lista_usuarios' className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre completo</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Nombre de usuario</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.fullName}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>
                        <button
                          className={`btn btn-primary btn-sm ${user.enabled ? 'btn-success' : 'btn-secondary'}`}
                          onClick={() => toggleUserStatus(user._id, user.enabled)}
                        >
                          {user.enabled ? 'Habilitado' : 'Inhabilitado'}
                        </button>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className='btn btn-warning btn-sm me-2' onClick={() => {setUsuarioSeleccionado(user);setMostrarEditar(true); }}>
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <Link to="/ListaDeUsuarios">
                          <button className='btn btn-danger btn-sm' onClick={() => handleEliminarUsuario(user._id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>

                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal para agregar usuario */}
        <AgregarUsuario
          show={mostrarModal}
          onHide={() => setMostrarModal(false)}
          onSubmit={handleAgregarUsuario}
        />

        {/* Modal para editar usuario */}
        <EditarUsuario
          usuario={usuarioSeleccionado}
          show={mostrarEditar}
          onHide={() => setMostrarEditar(false)}
          onActualizado={loadUsers}
        />

      </div>
    </div>
  );
}
