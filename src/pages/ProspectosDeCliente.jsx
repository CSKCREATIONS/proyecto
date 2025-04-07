import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from 'react-router-dom';

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
          <EncabezadoModulo titulo="Lista de clientes" />

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
              <table>
                <thead>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Agenda / Cotiza</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Link as={Link} to='/PedidosAgendados'><u>Canchas El Barrio</u></Link></td>
                    <td><Link as={Link} to='/PedidosAgendados'><u>Bogotá</u></Link></td>
                    <td><Link as={Link} to='/PedidosAgendados'><u>6904883</u></Link></td>
                    <td><Link as={Link} to='/PedidosAgendados'><u>elbarrio@gmail.com</u></Link></td>
                    <td><Link as={Link} to='/PedidosAgendados'><u>Agenda</u></Link></td>
                    <td><Link as={Link} to='/PedidosAgendados'><u>80</u></Link></td>

                    <button className="button">Editar</button>

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


