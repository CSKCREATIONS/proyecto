import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { openModal } from '../funciones/animaciones'
import Swal from 'sweetalert2'
import EditarCliente from '../components/EditarCliente';



/****Funcion para exportar a pdf*** */
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
        text: 'El Cliente ha sido borrado.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  });

const exportarPDF = () => {
  const input = document.getElementById('tabla_clientes');

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

    pdf.save('listaClientes.pdf');// nombre del pdf a descargar
  });
};

// Funcion exportar a Excel


const exportToExcel = () => {
  // Cambiar el ID a 'tabla_pedidos_agendados'
  const table = document.getElementById('tabla_clientes');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'listaClientes.xlsx');
};



export default function ListaDeClientes() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Lista de clientes"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar = 'Buscar cliente'
          />
          
          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_clientes'>
                <thead><br/>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Pedido</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td><Link as={Link} to='/PedidosEntregados'><u>100111</u></Link></td>
                    <td>Entregado</td>
                    <button className='btnTransparente' style={{ marginLeft: '1rem', height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')}   >
                      <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                    </button>
                    <Link to={`/ListaDeClientes`} className="icons" onClick={handleClick}>
                      <button className="btnTransparente" style={{ marginLeft: '1rem', height: '35px', width: '50px' }} type="button">
                        <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />

                      </button>
                    </Link>
                  </tr>

                </tbody>
              </table>
              <EditarCliente />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

