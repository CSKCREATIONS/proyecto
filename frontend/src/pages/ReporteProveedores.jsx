import React, { useEffect, useState } from 'react';
import {
  fetchProveedoresPorPais,
  fetchProveedoresPorEstado,
  fetchProductosPorProveedor,
  fetchProveedoresRecientes
} from '../funciones/reportes';

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Card, Statistic, Table, Tag } from 'antd';
import {
  GlobalOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ShoppingOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import Fijo from '../components/Fijo';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const ReportesProveedores = () => {
  const [porPais, setPorPais] = useState([]);
  const [porEstado, setPorEstado] = useState([]);
  const [productosPorProv, setProductosPorProv] = useState([]);
  const [recientes, setRecientes] = useState([]);

  useEffect(() => {
    fetchProveedoresPorPais().then(data => setPorPais(data || [])).catch(console.error);
    fetchProveedoresPorEstado().then(data => setPorEstado(data || [])).catch(console.error);
    fetchProductosPorProveedor().then(data => setProductosPorProv(data || [])).catch(console.error);
    fetchProveedoresRecientes().then(data => setRecientes(data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <Fijo />
      <div className="content">
        <div className="contenido-modulo">
          <EncabezadoModulo2 />
          <div className="reportes-container p-6 bg-gray-50 min-h-screen">
            <h1 className="titulo-reportes">Dashboard de Proveedores</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              <Card>
                <Statistic title="Total Países" value={porPais.length} prefix={<GlobalOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card><br/>
              <Card>
                <Statistic title="Activos" value={porEstado.find(e => e._id)?.cantidad || 0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
              </Card><br/>
              <Card>
                <Statistic title="Inactivos" value={porEstado.find(e => !e._id)?.cantidad || 0} prefix={<StopOutlined />} valueStyle={{ color: '#f5222d' }} />
              </Card><br/>
              <Card>
                <Statistic title="Proveedores con Productos" value={productosPorProv.length} prefix={<ShoppingOutlined />} valueStyle={{ color: '#fa8c16' }} />
              </Card><br/>
              <Card>
                <Statistic title="Proveedores Recientes" value={recientes.length} prefix={<UserAddOutlined />} valueStyle={{ color: '#722ed1' }} />
              </Card><br/>
            </div>

            <Card title="Proveedores por País" className="mb-10">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={porPais}
                    dataKey="cantidad"
                    nameKey="pais"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {porPais.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card><br/>

            <Card title="Proveedores por Estado" className="mb-10">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={porEstado.map(item => ({ estado: item._id ? 'Activo' : 'Inactivo', cantidad: item.cantidad }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estado" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card><br/>

            <Card title="Productos por Proveedor" className="mb-10">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productosPorProv}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalProductos" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Card><br/>

            <Card title="Proveedores Recientes">
              <Table
                dataSource={recientes}
                rowKey="nombre"
                pagination={false}
                columns={[
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre'
                  },
                  {
                    title: 'Empresa',
                    dataIndex: 'empresa',
                    key: 'empresa',
                    render: val => val || 'Sin empresa'
                  },
                  {
                    title: 'Fecha de Registro',
                    dataIndex: 'fechaCreacion',
                    key: 'fechaCreacion',
                    render: val => new Date(val).toLocaleDateString('es-CO')
                  }
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesProveedores;
