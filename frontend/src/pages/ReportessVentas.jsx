import React, { useState, useEffect } from 'react';
import {
  fetchVentasPorPeriodo,
  fetchPedidosPorEstado,
  fetchCotizaciones,
  fetchReporteClientes
} from '../funciones/reportes';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card, Statistic, Alert, Table, Tag } from 'antd';
import {
  ShoppingOutlined, DollarOutlined,
  FileTextOutlined, ContainerOutlined,
  UserOutlined, CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import Fijo from '../components/Fijo';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';

const ReportessVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cotizaciones, setCotizaciones] = useState(null);
  const [desdeCot, setDesdeCot] = useState('');
  const [hastaCot, setHastaCot] = useState('');
  const [clientes, setClientes] = useState({ total: 0, activos: 0, inactivos: 0, topClientes: [] });
  const colores = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'];

  useEffect(() => {
    const hoy = new Date();
    const hace30 = new Date();
    hace30.setDate(hoy.getDate() - 30);
    const formato = (fecha) => fecha.toISOString().split('T')[0];
    setDesde(formato(hace30));
    setHasta(formato(hoy));
    setDesdeCot(formato(hace30));
    setHastaCot(formato(hoy));
  }, []);

  useEffect(() => {
    if (desde && hasta) obtenerReporte();
  }, [desde, hasta]);

  useEffect(() => {
    obtenerPedidosPorEstado();
  }, []);

  useEffect(() => {
    if (desdeCot && hastaCot) obtenerCotizaciones();
  }, [desdeCot, hastaCot]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerReporte = async () => {
    try {
      setLoading(true);
      const response = await fetchVentasPorPeriodo(desde, hasta);
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerPedidosPorEstado = async () => {
    try {
      const response = await fetchPedidosPorEstado();
      setEstados(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos por estado:', error);
    }
  };

  const obtenerCotizaciones = async () => {
    try {
      const response = await fetchCotizaciones(desdeCot, hastaCot);
      setCotizaciones(response.data);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const response = await fetchReporteClientes();
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const totalVentas = Array.isArray(ventas) ? ventas.reduce((acc, item) => acc + (item.totalVentas || 0), 0) : 0;
  const totalIngresos = Array.isArray(ventas) ? ventas.reduce((acc, item) => acc + (item.totalIngresos || 0), 0) : 0;
  const totalPedidos = Array.isArray(estados) ? estados.reduce((acc, item) => acc + (item.cantidad || 0), 0) : 0;

  return (
    <div>
      <Fijo />
      <div className="content">
        <div className="contenido-modulo">
          <EncabezadoModulo2 />
          <div className="reportes-container p-6 bg-gray-50 min-h-screen">
            <h1 className="titulo-reportes">Dashboard de Ventas</h1>
            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              <Card>
                <Statistic title="Total Ventas (30 días)" value={totalVentas} prefix={<ShoppingOutlined />} valueStyle={{ color: '#007bff' }} />
              </Card><br/>
              <Card>
                <Statistic title="Total Ingresos" value={totalIngresos} prefix={<DollarOutlined />} valueStyle={{ color: '#28a745' }} formatter={value => `$${Number(value).toLocaleString()}`} />
              </Card><br/>
              <Card>
                <Statistic title="Cotizaciones Totales" value={cotizaciones?.total || 0} prefix={<FileTextOutlined />} valueStyle={{ color: '#722ed1' }} />
              </Card><br/>
              <Card>
                <Statistic title="Cotizaciones Enviadas" value={cotizaciones?.enviadas || 0} prefix={<ContainerOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card><br/>
              <Card>
                <Statistic title="Total Pedidos" value={totalPedidos} prefix={<ShoppingOutlined />} valueStyle={{ color: '#fa8c16' }} />
              </Card><br/>
              <Card>
                <Statistic title="Clientes Activos / Inactivos" value={`${clientes.activos} / ${clientes.inactivos}`} prefix={<UserOutlined />} valueStyle={{ color: '#595959' }} />
              </Card>
            </div><br/>

            {Array.isArray(estados) && estados.length > 0 && (
              <Card title="Pedidos por Estado" className="mb-10">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={estados} dataKey="cantidad" nameKey="estado" cx="50%" cy="50%" outerRadius={100} label>
                      {estados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}<br/>

            {cotizaciones && (
              <Card title="Cotizaciones por Período" className="mb-10">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { tipo: 'Total', cantidad: cotizaciones.total },
                    { tipo: 'Enviadas', cantidad: cotizaciones.enviadas },
                    { tipo: 'No enviadas', cantidad: cotizaciones.noEnviadas }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}<br/> 

            <Card title="Top 5 Clientes por Compras">
              <Table
                dataSource={clientes.topClientes || []}
                rowKey="email"
                pagination={false}
                locale={{ emptyText: 'No hay datos disponibles de clientes.' }}
                columns={[
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre'
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email'
                  },
                  {
                    title: 'Compras',
                    dataIndex: 'totalCompras',
                    key: 'totalCompras'
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'activo',
                    key: 'activo',
                    render: (activo) => (
                      <Tag color={activo ? 'green' : 'red'}>
                        {activo ? 'Activo' : 'Inactivo'}
                      </Tag>
                    )
                  }
                ]}
              />
            </Card><br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportessVentas;
