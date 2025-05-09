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
              <table id='tabla_clientes'>
                <thead>
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

