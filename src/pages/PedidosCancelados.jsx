import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { openModal } from '../funciones/animaciones'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_cancelados');

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

    pdf.save('pedidosCancelados.pdf');// nombre del pdf a descargar
  });
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

export default function PedidosCancelados() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo titulo="Pedidos Cancelados"
            exportarPDF = {exportarPDF} />

          <div className="grafica-notificaciones">
            {/* Gráfica de línea */}
            <div className="grafica">
              <ResponsiveContainer width={300} height={150}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="pedidos" stroke="gray" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica circular */}
            <div className="grafica-circular">
              <ResponsiveContainer width={380} height={300}>
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
              <table id='tabla_pedidos_cancelados'>
                <thead>
                  <tr>
                    <th style={{textAlign:'center'}} colSpan="5">Pedido</th>
                    <th style={{textAlign:'center'}} colSpan="4">Cliente</th>
                  </tr>
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>F. Agenda</th>
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
