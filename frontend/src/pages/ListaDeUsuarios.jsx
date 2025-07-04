import React, { useEffect, useState } from 'react'
import Fijo from '../components/Fijo'
import AgregarUsuario from '../components/AgregarUsuario'
import NavUsuarios from '../components/NavUsuarios'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'
import Swal from 'sweetalert2';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_lista_usuarios');

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 190;
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    // Mientras la imagen exceda la altura de la página, agregar nuevas páginas
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage(); // Añadir nueva página
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight; // Resta la altura de la página actual
    }

    pdf.save('listaUsuarios.pdf');// nombre del pdf a descargar
  });
};


// Funcion exportar a Excel


const exportToExcel = (todosLosUsuarios) => {
  if (!todosLosUsuarios || todosLosUsuarios.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  const dataFormateada = todosLosUsuarios.map(usuario => ({
    'Nombre completo': `${usuario.firstName || ''} ${usuario.secondName || ''} ${usuario.surname || ''} ${usuario.secondSurname || ''}`.trim(),
    'Rol': usuario.role,
    'Correo': usuario.email,
    'Usuario': usuario.username,
    'Estado': usuario.enabled ? 'Habilitado' : 'Inhabilitado',
    'Fecha de creación': new Date(usuario.createdAt).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataFormateada);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'ListaUsuarios.xlsx');
};


export default function ListaDeUsuarios() {

  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [puedeEditarUsuario, setPuedeEditarUsuario] = useState(false);
  const [puedeInhabilitarUsuario, setPuedeInhabilitarUsuario] = useState(false);
  const [puedeCrearUsuario, setPuedeCrearUsuario] = useState(false);
  const [puedeEliminarUsuario, setPuedeEliminarUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');


  /***esto se encarga de la paginacion de la tabla*****/
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; //numero de registros que se renderizan

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'x-access-token': token
        }
      });

      const data = await response.json();

      if (data.success) {
        setTodosLosUsuarios(data.data);
      } else {
        console.error('Error al obtener usuarios:', data.message);
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error.message);
    }
  };



  useEffect(() => {
    fetchUsuarios();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.permissions) {
      setPuedeCrearUsuario(user.permissions.includes('usuarios.crear'));
      setPuedeEditarUsuario(user.permissions.includes('usuarios.editar'));
      setPuedeInhabilitarUsuario(user.permissions.includes('usuarios.inhabilitar'));
      setPuedeEliminarUsuario(user.permissions.includes('usuarios.eliminar'));
    }
  }, []);



  useEffect(() => {
    const texto = filtroTexto.toLowerCase();

    const filtrados = todosLosUsuarios.filter((usuario) => {
      const nombreCompleto = `${usuario.firstName} ${usuario.secondName} ${usuario.surname} ${usuario.secondSurname}`.toLowerCase();
      const correo = usuario.email.toLowerCase();

      const coincideTexto =
        nombreCompleto.includes(texto) || correo.includes(texto);

      const coincideRol =
        filtroRol === 'todos' || usuario.role === filtroRol;

      const coincideEstado =
        filtroEstado === 'todos' ||
        (filtroEstado === 'habilitado' && usuario.enabled) ||
        (filtroEstado === 'inhabilitado' && !usuario.enabled);

      return coincideTexto && coincideRol && coincideEstado;
    });

    setUsuarios(filtrados);
    setCurrentPage(1); // Reiniciar paginación cuando se filtra
  }, [filtroTexto, filtroRol, filtroEstado, todosLosUsuarios]);




  const toggleEstadoUsuario = async (id, estadoActual, username) => {

    const accion = estadoActual ? 'inhabilitar' : 'habilitar';
    const participio = estadoActual ? 'inhabilitado' : 'habilitado';

    const confirmacion = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `¿Quieres ${accion} al usuario "${username}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/users/${id}/toggle-enabled`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({ enabled: !estadoActual })
        });

        const data = await response.json();

        if (data.success) {
          setUsuarios(prev =>
            prev.map(usuario =>
              usuario._id === id ? { ...usuario, enabled: !estadoActual } : usuario
            )
          );

          Swal.fire({
            icon: 'success',
            text: `Usuario ${participio} correctamente`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('Error en toggleEstadoUsuario:', error.message);
        Swal.fire('Error', 'No se pudo cambiar el estado del usuario', 'error');
      }
    }
  };


  const eliminarUsuario = async (usuario) => {
    const confirmacion = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `Esta acción eliminará permanentemente al usuario "${usuario.username}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/users/${usuario._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Remueve el usuario del estado actual
          setUsuarios(prev => prev.filter(u => u._id !== usuario._id));
          setTodosLosUsuarios(prev => prev.filter(u => u._id !== usuario._id));

          Swal.fire('Eliminado', 'Usuario eliminado correctamente.', 'success');
        } else {
          Swal.fire('Error', data.message || 'No se pudo eliminar el usuario.', 'error');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        Swal.fire('Error', 'Error en la conexión con el servidor.', 'error');
      }
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
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={() => exportToExcel(todosLosUsuarios)}><i className="fa-solid fa-file-excel"></i> <span>Exportar a Excel</span></button>
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={exportarPDF}><i className="fa-solid fa-file-pdf"></i><span> Exportar a PDF</span></button>
            </div>
            {puedeCrearUsuario && (
              <button onClick={() => openModal('agregar-usuario')} type='submit' className='btn-agregar'>+ Crear usuario</button>
            )}

          </div>

          <br />

          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar por nombre o correo"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              style={{ marginRight: '10px' }}
            />

            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              style={{ marginRight: '10px' }}
            >
              <option value="todos">Todos los roles</option>
              {[...new Set(todosLosUsuarios.map((u) => u.role))].map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="habilitado">Habilitado</option>
              <option value="inhabilitado">Inhabilitado</option>
            </select>
          </div>



          <div className="table-container">
            <table id='tabla_lista_usuarios'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre completo</th>
                  <th>Rol</th>
                  <th>Correo</th>
                  <th>Nombre de usuario</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Último acceso</th>

                </tr>
              </thead>
              <tbody>
                {currentItems.map((usuario, index) => (
                  <tr key={usuario._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{usuario.firstName} {usuario.secondName} {usuario.surname} {usuario.secondSurname}</td>
                    <td>{usuario.role}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.username}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={usuario.enabled}
                          onChange={() => {
                            if (puedeInhabilitarUsuario) {
                              toggleEstadoUsuario(usuario._id, usuario.enabled, usuario.username);
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Acción no permitida',
                                text: 'No tienes permisos para esta accion',
                                confirmButtonText: 'Entendido'
                              });
                            }
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>


                    <td>{new Date(usuario.createdAt).toLocaleDateString()}</td>
                    <td>
                      {usuario.lastLogin
                        ? new Date(usuario.lastLogin).toLocaleString('es-CO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'Nunca'}
                    </td>

                    {(puedeEditarUsuario || puedeEliminarUsuario) && (
                      <td>
                        {puedeEditarUsuario && (
                          <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => { setUsuarioEditando(usuario); openModal('editUserModal'); }}>
                            <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                          </button>
                        )}
                        {puedeEliminarUsuario && usuario.lastLogin === null && (
                          <button
                            className='btnTransparente'
                            style={{ height: '35px', width: '50px' }}
                            type="button"
                            onClick={() => eliminarUsuario(usuario)}
                          >
                            <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                          </button>
                        )}

                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && <p>No hay usuarios disponibles.</p>}


          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active-page' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <EditarUsuario usuario={usuarioEditando} fetchUsuarios={fetchUsuarios} />
        <AgregarUsuario />
      </div>
    </div>
  );
}
