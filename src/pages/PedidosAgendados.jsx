import React from "react";
import Fijo from "../components/Fijo";
import NavVentas from "../components/NavVentas";
import EncabezadoModulo from "../components/EncabezadoModulo";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { openModal } from '../funciones/animaciones'
import EditarPedido from "../components/EditarPedido";



/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_agendados');

  // Ocultar elementos con clase 'no-pdf'
  const elementosNoPdf = input.querySelectorAll('.no-export');
  elementosNoPdf.forEach(el => el.style.display = 'none');

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

    pdf.save('pedidosAgendados.pdf');

    // Restaurar visibilidad de los elementos
    elementosNoPdf.forEach(el => el.style.display = '');
  });
};



// Funcion exportar a Excel


const exportToExcel = () => {
  const table = document.getElementById('tabla_pedidos_agendados');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  // Ocultar temporalmente los íconos o columnas no deseadas
  const elementosNoExport = table.querySelectorAll('.no-export');
  elementosNoExport.forEach(el => el.style.display = 'none');

  // Exportar tabla a Excel
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'pedidosAgendados.xlsx');

  // Restaurar visibilidad
  elementosNoExport.forEach(el => el.style.display = '');
};


// Datos que se mostraran en la grafica 
const data = [
  { name: "Enero", pedidos: 20 },
  { name: "Febrero", pedidos: 35 },
  { name: "Marzo", pedidos: 40 },
  { name: "Abril", pedidos: 50 },
  { name: "Mayo", pedidos: 45 },
];

// Mensajes de las notificaciones 
const notificaciones = [
  { id: 1, mensaje: "Pedido 111111 próximo a cumplirse" },
  { id: 2, mensaje: "Pedido 1092 próximo a cumplirse" },
];



export default function PedidosAgendados() {
  const navigate = useNavigate();
  //cancelar pedido
  const handleCancelarPedido = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este pedido se cancelará y no podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // texto despues del si
        Swal.fire('Cancelado', 'El pedido ha sido cancelado.', 'success');
      }
    });
  };


  //pedido confirmado
  const handleConfirmarPedido = () => {
    Swal.fire({
      title: 'Marcar como cumplido',
      text: '¿Se ha cumplido con el pedido 011021',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // texto despues del si
        Swal.fire('Listo', 'Se ha marcado como cumplido.', 'success');
      }
    });
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo titulo="Pedidos Agendados"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel} />

          <div className="grafica-notificaciones">
            {/* Gráfica */}
            <div className="grafica">
              <ResponsiveContainer width={380} height={150}> {/* tamaño */}
                <LineChart data={data}>{/* significa q son datos y una grafica de linea en este caso */}
                  <CartesianGrid strokeDasharray="3 3" />{/* es para la cuadricula de fondo */}
                  <XAxis dataKey="name" /> {/* define el eje x y con hide se oculta los nombres :)*/}
                  <YAxis /> {/* oculta el eje y */}
                  <Tooltip /> {/* muestra la cantidad de pedidos al pasar el mouse por la grafica */}
                  <Line type="monotone" dataKey="pedidos" stroke="gray" strokeWidth={2} /> {/* el dataKey es el nombre que aparece en la grafica y el strokeWidth es el grosor de la linea */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Notificaciones */}
            <div className="notificaciones"> {/* proximamente se hace el llado a al const identificandolo por el id donde se mostraran las alertas de los reportes */}
              {notificaciones.map((notif) => (
                <div key={notif.id} className="notificacion"> {/* icono de advertencia */}
                  <FaExclamationTriangle className="icono" />
                  <a href="#" className="mensaje">
                    {notif.mensaje}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla */}
          <div className="container-tabla">
            <div className="table-container" >
              <table id="tabla_pedidos_agendados">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }} colSpan="5">Pedido</th>
                    <th style={{ textAlign: 'center' }} colSpan="4">Cliente</th>
                  </tr>
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>F. Agendamiento</th>
                    <th>F. Entrega</th>
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
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>N/A</td>
                    <div className="no-export" style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => openModal('editarPedidoModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>

                      <button className="btnTransparente" style={{ height: '35px', width: '50px' }} onClick={handleCancelarPedido}>
                        <i className="fa-solid fa-cancel fa-xl" style={{ color: 'red' }}></i>
                      </button>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={handleConfirmarPedido}
                      >
                        <i className="fa-solid fa-check fa-xl" style={{ color: 'green' }}></i>
                      </button>
                    </div>


                  </tr>
                </tbody>
              </table>
              <EditarPedido />

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}