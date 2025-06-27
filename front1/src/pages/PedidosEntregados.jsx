import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_entregados');

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

    pdf.save('pedidosEntregados.pdf');// nombre del pdf a descargar
  });
};

//Funcion exportar a Excel
const exportToExcel = () => {
  // Cambiar el ID a 'tabla_pedidos_agendados'
  const table = document.getElementById('tabla_pedidos_entregados');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'pedidosEntregados.xlsx');
};



export default function PedidosEntregados() {
  const navigate = useNavigate();
  //marcado devuelto
  const handleMarcadoDevuelto = () => {
    Swal.fire({
      title: 'Marcar como devuelto',
      text: '¿Se ha recibido una devolucion del pedido 110211?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Ya quedo', 'Enlistado como devuelto.', 'success').then(() => {
          navigate('/Devoluciones');
        });
      }
    });
  }
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Pedidos Entregados"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar = 'Buscar pedido'
          />


          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_pedidos_entregados'>
                <thead><br/>
                  <tr>
                    <th style={{ textAlign: 'center' }} colSpan="6">Pedido</th>
                    <th style={{ textAlign: 'center' }} colSpan="4">Cliente</th>
                  </tr>
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>F. Agenda</th>
                    <th>F. Entrega</th>
                    <th>Soporte</th>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Pasto</td>
                    <td>5</td>
                    <td>10/04/2025</td>
                    <td>15/04/2025</td>
                    <td>Ahhh</td>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>N/A</td>

                    <div className="no-export">
                      <button className="btnTransparente" onClick={handleMarcadoDevuelto} style={{ marginLeft: '1rem', height: '35px', width: '50px' }}>
                        <i className="fa-solid fa-rotate fa-xl" style={{ color: '#007bff' }}></i>
                      </button>
                    </div>


                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
