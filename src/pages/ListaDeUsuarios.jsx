import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import EncabezadoModulo from '../components/EncabezadoModulo'
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
    <div >
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Lista de usuarios'
            exportarPDF = {exportarPDF}
            exportToExcel={exportToExcel}
            buscar = 'Buscar usuario'
          />

          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_lista_usuarios'>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Nombre completo</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Username</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td>105323234</td>
                    <td>Natalia Maria</td>
                    <td>Admin</td>
                    <td>Nat@gmail.com</td>
                    <td>Natalia.Mar</td>
                    <td>30204342</td>
                    <td>Habilitado</td>
                    <td >20/03/2025</td>
                    <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}>
                      <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                    </button>
                    <Link to={`/ListaDeUsuarios`}  onClick={handleClick}>
                      <button className='btnTransparente' style={{ marginLeft: '.7rem', height: '35px', width: '50px' }} type="button">
                        <i className="fa-solid fa-trash fa-xl" style={{ color: 'red' }}></i>
                      </button>
                    </Link>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EditarUsuario />
       


      </div>
    </div>
  )
}
