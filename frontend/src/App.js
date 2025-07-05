import React from 'react';
import { Routes, Route, BrowserRouter, } from "react-router-dom";
import ListaDeUsuarios from './pages/ListaDeUsuarios';
import CambiarContrasena from './components/CambiarContraseña';
import Perfil from './pages/Perfil';
import RolesYPermisos from './pages/RolesYPermisos'
import Home from './pages/Home';
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
import Error404 from './pages/Error404';
import Error504 from './pages/Error504';
import Empresa from './pages/Empresa';
import Proveedores from './pages/Proveedores';
import HistorialCompras from './pages/HistorialCompras';
import GestionProductos from './pages/GestionProductos';
import Categorias from './pages/Categorias';
import Subcategorias from './pages/Subcategorias';
import ReporteVentas from './pages/ReporteVentas';
import PrivateRoute from './routes/PrivateRoute';
import PermisoRoute from './routes/PermisoRoute';
import PedidosDevueltos from './pages/PedidosDevueltos';
import PedidosDespachados from './pages/PedidosDespachados';
import Ventas from './pages/Ventas';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Rutas públicas */}
          <Route index path='/' element={<Login />} />
          <Route path='/RecuperarContraseña' element={<RecuperarContraseña />} />

          <Route path='/Home' element={<PrivateRoute><Home /></PrivateRoute>} />

          <Route
            path='/ListaDeUsuarios'
            element={
              <PrivateRoute>
                <PermisoRoute permiso="usuarios.ver">
                  <ListaDeUsuarios />
                </PermisoRoute>
              </PrivateRoute>

            }
          />

          <Route
            path="/RolesYPermisos"
            element={
              <PermisoRoute permiso="roles.ver">
                <RolesYPermisos />
              </PermisoRoute>
            }
          />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />

          <Route path="/AgendarVenta/:id" element={<AgendarVenta />} />
          <Route path='/PedidosAgendados' element={<PedidosAgendados />} />
          <Route path='/PedidosEntregados' element={<PedidosEntregados />} />
          <Route path='/PedidosCancelados' element={<PedidosCancelados />} />
          <Route path='/RegistrarCotizacion' element={<RegistrarCotizacion />} />
          <Route path='/ListaDeCotizaciones' element={<ListaDeCotizaciones />} />
          <Route path='/ListaDeClientes' element={<ListaDeClientes />} />
          <Route path='/ProspectosDeClientes' element={<ProspectosDeCliente />} />
          <Route path='/Perfil' element={<Perfil />} />
          <Route path='Login' element={<Login />} />
          <Route path="/error504" element={<Error504 />} />
          <Route path="*" element={<Error404 />} />
          <Route path="Empresa" element={<Empresa />} />
          <Route path='/GestionProductos' element={<GestionProductos />} />
          <Route path='/ReporteVentas' element={<ReporteVentas />} /> 
          <Route path='/Proveedores' element={<Proveedores />} />
          <Route path='/HistorialCompras' element={<HistorialCompras />} />
          <Route path='/Categorias' element={<Categorias />} />
          <Route path='/Subcategorias' element={<Subcategorias />} />
          <Route path='/PedidosDevueltos' element={<PedidosDevueltos />} />
          <Route path='/PedidosDespachados' element={<PedidosDespachados />} />
          <Route path='/Ventas' element={<Ventas />} />

          {/* Rutas privadas */}


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;