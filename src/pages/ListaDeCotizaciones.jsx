import React, { useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import { openModal } from '../funciones/animaciones';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const exportarPDF = () => {
  const input = document.getElementById('tabla_cotizaciones');
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

    pdf.save('listaCotizaciones.pdf');
  });
};

const exportToExcel = () => {
  const table = document.getElementById('tabla_cotizaciones');
  if (!table) return;
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'listaCotizaciones.xlsx');
};


export default function ListaDeCotizaciones() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleEliminarCotizacion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta Cotización se cancelará y no podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Perfecto', 'Se ha eliminado la cotización.', 'success');
      }
    });
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Lista de cotizaciones"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar='Buscar cotización'
          />

          <div className="container-tabla"><br />
            <div className="table-container">
              <table id='tabla_cotizaciones'>
                <thead>
                  <tr>
                    {/**Al seleccionar el numero de cotizacion debe abrir un popup con el formato de la cotizacion seleccionada */}
                    <th># Cotizacion</th>
                    <th>Fecha elaboración</th>
                    <th>Cliente</th>
                    <th>Enviado por correo</th>
                  </tr>
                </thead>
                <tr>
                    <th></th>
                    <th><div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="date" className="cuadroTexto" />
                      </div></th>
                    <th><div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="text" className="cuadroTexto" placeholder="Buscar cliente..." />
                      </div></th>
                    <th><select name="" id="">
                      <option value="">Si</option>
                      <option value="">No</option></select></th>
                  </tr>
                <tbody>
                  <tr>
                    <td><a onClick={() => openModal('cotizacionPreview')}>C-18839</a></td>
                    <td>13/06/2025</td>
                    <td>SDFAF</td>
                    <td>Si</td>

                    <button className='btnTransparente' onClick={handleEliminarCotizacion}>
                      <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                    </button>

                    {/**Debe abrir agendar cotizacion como pedido */}
                    <button className='btnTransparente' onClick={() => openModal('')}>
                      <i >logo calendario</i>
                    </button>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
