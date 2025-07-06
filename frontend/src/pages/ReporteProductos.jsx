import React, { useState, useEffect } from 'react';
import NavProductos from '../components/NavProductos'
import { fetchReporteConsolidado } from '../funciones/reportes';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
  ResponsiveContainer, LabelList, CartesianGrid
} from 'recharts';
import { Alert, Card, Statistic, Table, Tag } from 'antd';
import {
  ShoppingOutlined, WarningOutlined,
  CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import Fijo from '../components/Fijo';
import EncabezadoModulo2 from '../components/EncabezadoModulo2';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reportes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchReporteConsolidado();
      console.log("📊 Datos del reporte:", response); // ← agrega esto
      setData(response);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para gráficos
  const estadoData = data?.productosPorEstado?.map(item => ({
    name: item._id ? 'Activos' : 'Inactivos',
    value: item.count,
    color: item._id ? '#4CAF50' : '#F44336',
    icon: item._id ? <CheckCircleOutlined /> : <StopOutlined />
  }));

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavProductos/>
        <div className="contenido-modulo">
          <EncabezadoModulo2 />
          <div className="reportes-container">
            <h1 className="titulo-reportes">Dashboard de productos</h1>
            <br />

            {loading ? (
              <div className="cargando">Cargando datos...</div>
            ) : (
              <>
                {/* Resumen Estadístico */}
                <div className="resumen-estadistico">
                  <Card className="estadistica-card">
                    <Statistic
                      title="Total de Productos"
                      value={data?.totalProductos}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                  <br />

                  <Card className="estadistica-card alerta">
                    <Statistic
                      title="Productos con bajo stock"
                      value={data?.productosBajoStock}
                      prefix={<WarningOutlined />}
                      valueStyle={{ color: '#f5222d' }}
                    />
                    <Alert
                      message={`${data?.productosBajoStock} productos tienen menos de 10 unidades en stock`}
                      type="warning"
                      showIcon
                      className="alerta-stock"
                    />
                  </Card>
                  <br />
                </div>

                {/* Gráficos */}
                <div className="graficos-container">
                  {/* Gráfico de estado de productos */}
                  <Card title="Estado de Productos" className="grafico-card">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={estadoData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {estadoData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} productos`, 'Cantidad']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                  <br />

                  {/* Gráfico de distribución por categoría */}
                  <Card title="Distribución por Categoría" className="grafico-card">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={data?.productosPorCategoria}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip
                          formatter={(value) => [`${value} productos`, 'Cantidad']}
                          labelFormatter={(label) => `Categoría: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="totalProductos" name="Total Productos" fill="#8884d8">
                          <LabelList dataKey="totalProductos" position="right" />
                        </Bar>
                        <Bar dataKey="productosActivos" name="Productos Activos" fill="#4CAF50">
                          <LabelList dataKey="productosActivos" position="right" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                  <br />
                </div>

                {/* Tabla de productos por categoría */}
                <Card title="Detalle por Categoría" className="tabla-card">
                  <Table
                    dataSource={data?.productosPorCategoria}
                    rowKey="_id"
                    pagination={false}
                    columns={[
                      {
                        title: 'Categoría',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text, record) => (
                          <div>
                            <strong>{text}</strong>
                            <div className="descripcion">{record.description}</div>
                          </div>
                        )
                      },
                      {
                        title: 'Estado',
                        dataIndex: 'activo',
                        key: 'activo',
                        render: (activo) => (
                          <Tag color={activo ? 'green' : 'red'}>
                            {activo ? 'ACTIVO' : 'INACTIVO'}
                          </Tag>
                        )
                      },
                      {
                        title: 'Fecha Creación',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (date) => new Date(date).toLocaleDateString()
                      },
                      {
                        title: 'Total Productos',
                        dataIndex: 'totalProductos',
                        key: 'totalProductos',
                        align: 'center'
                      },
                      {
                        title: 'Productos Activos',
                        dataIndex: 'productosActivos',
                        key: 'productosActivos',
                        align: 'center'
                      }
                    ]}
                  />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;