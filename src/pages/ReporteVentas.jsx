import React from 'react';
import { Card, CardContent } from '../components/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Calendar from '../components/Calendar';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';

// Datos de ejemplo mejorados
const salesByMonth = [
  { month: 'Ene', total: 4000 },
  { month: 'Feb', total: 3000 },
  { month: 'Mar', total: 5000 },
  { month: 'Abr', total: 4500 },
  { month: 'May', total: 6000 },
];

const salesByDay = [
  { day: 'Lun', total: 800 },
  { day: 'Mar', total: 1200 },
  { day: 'Mié', total: 1100 },
  { day: 'Jue', total: 1600 },
  { day: 'Vie', total: 900 },
  { day: 'Sáb', total: 600 },
  { day: 'Dom', total: 400 },
];

const quotesVsSales = [
  { name: 'Convertidas', value: 35 },
  { name: 'No convertidas', value: 50 },
];

const COLORS = ['#4ade80', '#f87171'];

const topProducts = [
  { name: 'Producto A', sales: 1500 },
  { name: 'Producto B', sales: 1200 },
  { name: 'Producto C', sales: 900 },
];

export default function ReporteVentas() {
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo2 titulo="Dashboard Ventas" />

          {/* Sección de KPIs principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4"><br/>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Ventas Totales</h3>
                <p className="text-2xl font-bold text-green-600">$6.000.000</p>
                <p className="text-sm text-gray-500">+12% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Cotizaciones</h3>
                <p className="text-2xl font-bold">85</p>
                <p className="text-sm text-gray-500">15 pendientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Tasa Conversión</h3>
                <p className="text-2xl font-bold">41%</p>
                <p className="text-sm text-gray-500">35/85 cotizaciones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Clientes Nuevos</h3>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-500">+5% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Sección de gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* Gráfico de ventas por día */}
            <Card className="col-span-1">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Ventas por Día (Semana)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reporte cotizaciones vs ventas */}
            <Card className="col-span-1">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Cotizaciones vs Ventas</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={quotesVsSales}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {quotesVsSales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {quotesVsSales.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendario */}
            <Card className="col-span-1">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Calendario</h3>
                <Calendar 
                  mode="single" 
                  className="rounded-md border"
                  // Puedes agregar eventos destacados como prop
                />
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Eventos Hoy</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Reunión con cliente A
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Entrega de pedido #1234
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección inferior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
            {/* Gráfico de ventas por mes */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Ventas por Mes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#4f46e5" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top productos */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{ left: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}