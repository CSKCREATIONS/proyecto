// src/funciones/reportes.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reportes'; // Ajusta esta URL

// Función para obtener categorías
export const fetchReporteCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Función para obtener productos con filtros
export const fetchReporteProductos = async (filters = {}) => {
  try {
    const params = { ...filters };
    const response = await axios.get(`${API_URL}/productos`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Función para obtener reporte consolidado
export const fetchReporteConsolidado = async () => {
  try {
    const response = await axios.get(`${API_URL}/consolidado`);
    console.log("📊 Datos recibidos del backend:", response.data); // <-- para depurar
    return response.data.data;
  } catch (error) {
    console.error("Error fetching consolidated report:", error);
    throw error;
  }
};

////

export const fetchVentasPorPeriodo = async (desde, hasta) => {
  const response = await axios.get(`${API_URL}/ventas/por-periodo`, {
    params: { desde, hasta }
  });
  return response.data.data;
};


export const fetchPedidosPorEstado = async () => {
  const response = await axios.get(`${API_URL}/ventas/por-estado`);
  return response.data;
};


export const fetchCotizaciones = async (desde, hasta) => {
  const response = await axios.get(`${API_URL}/ventas/cotizaciones`, {
    params: { desde, hasta }
  });
  return response.data;
};

export const fetchReporteClientes = async () => {
  const response = await axios.get(`${API_URL}/clientes`);
  return response.data;
};



//prov
export const fetchProveedoresPorPais = async () => {
  const res = await axios.get(`${API_URL}/por-pais`);
  return res.data.data;
};

export const fetchProductosPorProveedor = async () => {
  const res = await axios.get(`${API_URL}/por-productos`);
  return res.data.data;
};

export const fetchProveedoresPorEstado = async () => {
  const res = await axios.get(`${API_URL}/por-estado`);
  return res.data.data;
};

export const fetchProveedoresRecientes = async () => {
  const res = await axios.get(`${API_URL}/recientes`);
  return res.data.data;
};


