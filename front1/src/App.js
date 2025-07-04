import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import RutaPrivada from './components/RutaPrivada';

import ListaDeUsuarios from './pages/ListaDeUsuarios';
import Home from './pages/Home';
import AñadirRol from './pages/AñadirRol';
import AgendarVenta from './pages/AgendarVenta';
import PedidosAgendados from './pages/PedidosAgendados';
import PedidosEntregados from './pages/PedidosEntregados';
import PedidosCancelados from './pages/PedidosCancelados';
import RegistrarCotizacion from './pages/RegistrarCotizacion';
import ListaDeCotizaciones from './pages/ListaDeCotizaciones';
import ListaDeClientes from './pages/ListaDeClientes';
import ProspectosDeCliente from './pages/ProspectosDeCliente';
import Login from './pages/Login';
import RecuperarContraseña from './pages/RecuperarContraseña';
import Perfil from './pages/Perfil';
import Error404 from './pages/Error404';
import Error504 from './pages/Error504';
import Empresa from './pages/Empresa';
import GestionProductos from './pages/GestionProductos';
import Categorias from './pages/Categorias';
import Subcategorias from'./pages/Subcategorias';
import RolesYPermisos from './pages/RolesYPermisos'
import Proveedores from './pages/Proveedores';
import PedidosDevueltos from './pages/PedidosDevueltos';
import PedidosDepachados from './pages/PedidosDespachados';
import Ventas from './pages/Ventas';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route index path="/Login" element={<Login />} />
          <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />

          {/* Rutas protegidas */}
          <Route path="/Home" element={<RutaPrivada><Home /></RutaPrivada>} />
          <Route path="/ListaDeUsuarios" element={<RutaPrivada><ListaDeUsuarios /></RutaPrivada>} />
          <Route path="/AñadirRol" element={<RutaPrivada><AñadirRol /></RutaPrivada>} />
          <Route path="/AgendarVenta/:id" element={<RutaPrivada><AgendarVenta /></RutaPrivada>} />
          <Route path="/PedidosAgendados" element={<RutaPrivada><PedidosAgendados /></RutaPrivada>} />
          <Route path="/ReporteVentas" element={<RutaPrivada><PedidosAgendados /></RutaPrivada>} />
          <Route path="/PedidosDevueltos" element={<RutaPrivada><PedidosDevueltos /></RutaPrivada>} />
          <Route path="/PedidosEntregados" element={<RutaPrivada><PedidosEntregados /></RutaPrivada>} />
          <Route path="/PedidosCancelados" element={<RutaPrivada><PedidosCancelados /></RutaPrivada>} />
          <Route path="/RegistrarCotizacion" element={<RutaPrivada><RegistrarCotizacion /></RutaPrivada>} />
          <Route path="/ListaDeCotizaciones" element={<RutaPrivada><ListaDeCotizaciones /></RutaPrivada>} />
          <Route path="/ListaDeClientes" element={<RutaPrivada><ListaDeClientes /></RutaPrivada>} />
          <Route path="/ProspectosDeClientes" element={<RutaPrivada><ProspectosDeCliente /></RutaPrivada>} />
          <Route path="/Perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
          <Route path="/Empresa" element={<RutaPrivada><Empresa /></RutaPrivada>} />
          <Route path="/Categorias" element={<RutaPrivada><Categorias></Categorias></RutaPrivada>}></Route>
          <Route path="/Subcategorias" element={<RutaPrivada><Subcategorias></Subcategorias></RutaPrivada>}></Route>
          <Route path="/GestionProductos" element={<RutaPrivada><GestionProductos /></RutaPrivada>} />
          <Route path="/RolesYPermisos" element={<RutaPrivada><RolesYPermisos/></RutaPrivada>}/>
          <Route path="/Proveedores" element={<RutaPrivada><Proveedores/></RutaPrivada>} />
          <Route path="/PedidosDepachados" element={<RutaPrivada><PedidosDepachados/></RutaPrivada>} />
          <Route path="/Ventas" element={<RutaPrivada><Ventas/></RutaPrivada>} />

          {/* Errores */}
          <Route path="/error504" element={<Error504 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
