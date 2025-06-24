import React, { useEffect, useState } from 'react'
import Fijo from '../components/Fijo'
import AgregarUsuario from '../components/AgregarUsuario'
import NavUsuarios from '../components/NavUsuarios'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
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


const exportToExcel = () => {
  // Cambiar el ID a 'tabla_pedidos_agendados'
  const table = document.getElementById('tabla_lista_usuarios');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'ListaUsuarios.xlsx');
};


export default function ListaDeUsuarios() {


  const [usuarios, setUsuarios] = useState([]);

  /***esto se encarga de la paginacion de la tabla*****/
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; //numero de registros que se renderizan

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // FUNCIONES
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token'); //obtiene el token del usuario que hace la peticion

      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'x-access-token': token
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsuarios(data.data);
      } else {
        console.error('Error al obtener usuarios:', data.message);
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);




  const handleClick = () =>
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Listo!',
          text: 'El usuario ha sido borrado.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3>Lista de usuarios</h3>
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={exportToExcel}><i className="fa-solid fa-file-excel"></i> <span>Exportar a Excel</span></button>
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={exportarPDF}><i className="fa-solid fa-file-pdf"></i><span> Exportar a PDF</span></button>
            </div>
            <button onClick={() => openModal('agregar-usuario')} type='submit' className='btn-agregar'>+ Agregar usuario</button>
          </div>

          <br />

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
                </tr>
              </thead>
              <tbody>
                {currentItems.map((usuario, index) => (
                  <tr key={usuario._id}>
                    <td>{index + 1}</td>
                    <td>{usuario.firstName} {usuario.secondName} {usuario.surname} {usuario.secondSurname}</td>
                    <td>{usuario.role}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.username}</td>
                    <td style={{ color: usuario.enabled ? 'green' : 'red' }}>
                      {usuario.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </td>
                    <td>{new Date(usuario.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>
                      <Link to={`/ListaDeUsuarios`} onClick={() => console.log('Eliminar usuario', usuario._id)}>
                        <button className='btnTransparente' style={{ height: '35px', width: '50px' }} type="button">
                          <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                        </button>
                      </Link>
                    </td>
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

        <EditarUsuario />
        <AgregarUsuario />
      </div>
    </div>
  );
}
