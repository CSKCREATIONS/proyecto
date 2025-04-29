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
import ReagnedarPedido from '../components/ReagendarPedido';
import { openModal } from '../funciones/animaciones'


/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_devueltos');

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

    pdf.save('pedidosDevueltos.pdf');// nombre del pdf a descargar
  });
};

// Funcion exportar a Excel


const exportToExcel = () => {
  // Cambiar el ID a 'tabla_pedidos_agendados'
  const table = document.getElementById('tabla_pedidos_devueltos');

  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }

  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'Devoluciones.xlsx');
};


// Datos que se mostraran en la gráfica de línea
const data = [
  { name: "Enero", pedidos: 20 },
  { name: "Febrero", pedidos: 35 },
  { name: "Marzo", pedidos: 40 },
  { name: "Abril", pedidos: 50 },
  { name: "Mayo", pedidos: 45 },
];

// Datos para la gráfica circular
const dataCircular = [
  { name: "Entregados", value: 60 },
  { name: "Pendientes", value: 30 },
  { name: "Cancelados", value: 10 },
];

const COLORS = ["#4caf50", "#ff9800", "#f44336"];



export default function Devoluciones() {
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
      navigate('/PedidosCancelados');
    });
  };
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Pedidos Devueltos"
            exportToExcel={exportToExcel}
            exportarPDF={exportarPDF}
            buscar = 'Buscar pedido'
          />

          <div className="grafica-notificaciones">
            {/* Gráfica de línea */}
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

            {/* Gráfica circular */}
            <div className="grafica-circular">
              <ResponsiveContainer width={390} height={240}>
                <PieChart> {/* componente que define que es una grafica circular */}
                  <Pie
                    data={dataCircular}
                    cx="50%"
                    cy="50%"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={50}
                    dataKey="value"
                  > {/* data circular pasa los datos para la grafica, el cx y cy posiscionan la grafica dentro del contenedor, con el label se muestra como se van a definirl las etiquetas, el outerRadius es para el radio, el data ya es la propiedad  */}
                    {dataCircular.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie> {/* el data.. recore el array y hace que se efectuen los colores */}
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_pedidos_devueltos'>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }} colSpan="5">Pedido</th>
                    <th style={{ textAlign: 'center' }} colSpan="4">Cliente</th>
                  </tr>
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>F. Agenda</th>
                    <th>F. Devolucion</th>
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
                      <button className="btnTransparente" style={{ marginLeft: ".5rem", height: '35px', width: '50px' }} onClick={handleCancelarPedido}>
                        <i className="fa-solid fa-cancel fa-xl" style={{ color: '#dc3545' }} />
                      </button>
                      <button className="btnTransparente" style={{ marginLeft: ".2rem", height: '35px', width: '50px' }} onClick={() => openModal('editUserModal')} >
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>
                    </div>
                  </tr>

                </tbody>

              </table>

              <ReagnedarPedido />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
