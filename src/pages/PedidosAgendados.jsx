import React from "react";
import Fijo from "../components/Fijo";
import NavVentas from "../components/NavVentas";
import EncabezadoModulo from "../components/EncabezadoModulo";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaExclamationTriangle } from "react-icons/fa";


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
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo titulo="Pedidos Agendados" />


          <div className="grafica-notificaciones">
            {/* Gráfica */}
            <div className="grafica">
              <ResponsiveContainer width={300} height={150}> {/* tamaño */}
                <LineChart data={data}>{/* significa q son datos y una grafica de linea en este caso */}
                  <CartesianGrid strokeDasharray="3 3" />{/* es para la cuadricula de fondo */}
                  <XAxis dataKey="name" hide /> {/* define el eje x y con hide se oculta los nombres :)*/}
                  <YAxis hide /> {/* oculta el eje y */}
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
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{textAlign:'center'}}colSpan="5">Pedido</th>
                    <th style={{textAlign:'center'}}colSpan="4">Cliente</th>
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
                    <th>Acciones</th>
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
                    <td>
                      <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} ></button>
                      <button className='btn' style={{ marginLeft: '1rem', height: '30px', width: '50px' }} ></button>
                    </td>
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