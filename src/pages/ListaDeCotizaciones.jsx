import React, { useState } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import { openModal } from '../funciones/animaciones';
import AgendarCotPed from '../components/AgendarCotPed';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Navigate } from 'react-router-dom';

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

const data = [
  { name: "Enero", pedidos: 20 },
  { name: "Febrero", pedidos: 35 },
  { name: "Marzo", pedidos: 40 },
  { name: "Abril", pedidos: 50 },
  { name: "Mayo", pedidos: 45 },
];

const dataCircular = [
  { name: "Entregados", value: 60 },
  { name: "Pendientes", value: 30 },
  { name: "Cancelados", value: 10 },
];

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

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
            buscar = 'Buscar cotización'
          />

          {/* GRÁFICAS */}
          <div className="grafica-notificaciones">
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
            <div className="grafica-circular">
              <ResponsiveContainer width={390} height={240}>
                <PieChart>
                  <Pie
                    data={dataCircular}
                    cx="50%" cy="50%"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {dataCircular.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLA */}
          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_cotizaciones'>
                <thead>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Producto</th>
                    <th>Fecha</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>Pasto</td>
                    <td>07/04/2027</td>
                    <td>N/A</td>
                    
                      <button className='btnTransparente' onClick={handleEliminarCotizacion}>
                        <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                      </button>
                      &nbsp;&nbsp;
                      <button className='btnTransparente' onClick={() => openModal('editUserModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>
                    
                  </tr>
                </tbody>
              </table>
              <AgendarCotPed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
