import React, { useEffect, useState } from 'react'
import Fijo from '../components/Fijo'
import AgregarUsuario from '../components/AgregarUsuario'
import NavCompras from '../components/NavCompras'
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
  const input = document.getElementById('tabla_historialCompras');

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

    pdf.save('Historial de compras.pdf');// nombre del pdf a descargar
  });
};


// Funcion exportar a Excel


const exportToExcel = () => {
  // Cambiar el ID a 'tabla_pedidos_agendados'
  const table = document.getElementById('tabla_historialCompras');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'Historial de compras.xlsx');
};


export default function CatalogoProveedores() {




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
        <NavCompras />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3>Catalogo de proveedores</h3>
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={exportToExcel}><i className="fa-solid fa-file-excel"></i> <span>Exportar a Excel</span></button>
              <button style={{ background: 'transparent', cursor: 'pointer' }} onClick={exportarPDF}><i className="fa-solid fa-file-pdf"></i><span> Exportar a PDF</span></button>
            </div>
            <button onClick={() => openModal('agregar-usuario')} type='submit' className='btn-agregar'>+ Agregar Proveedor</button>
          </div>

          <br />

          <div className="table-container">
            <table id='tabla_'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del proveedor</th>
                  <th>NIT</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Ciudad</th>
                  <th>Tipo</th>
                  <th>Condiciones de pago</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>



          </div>

        </div>

        <EditarUsuario />
        <AgregarUsuario />
      </div>
    </div>
  );
}
