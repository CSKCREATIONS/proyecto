const mongoose = require("mongoose");
require("dotenv").config();

async function updateGerente() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");
    
    const db = mongoose.connection.db;
    
    const result = await db.collection("roles").updateMany(
      { name: { $in: ["gerente", "Gerente"] } },
      { 
        $set: { 
          description: "Acceso de solo lectura a todos los módulos",
          enabled: true,
          permissions: [
            "usuarios.ver",
            "categorias.ver", 
            "subcategorias.ver",
            "productos.ver",
            "clientes.ver",
            "proveedores.ver",
            "ventas.ver",
            "compras.ver",
            "cotizaciones.ver",
            "pedidos.ver",
            "reportesProductos.ver",
            "reportesVentas.ver",
            "reportesCompras.ver"
          ],
          updatedAt: new Date()
        }
      }
    );
    
    console.log("Gerente actualizado:", result.modifiedCount, "documentos");
    
    const gerentes = await db.collection("roles").find({ 
      name: { $in: ["gerente", "Gerente"] } 
    }).toArray();
    
    gerentes.forEach(g => console.log(g.name + ":", g.permissions.length, "permisos -", g.permissions.join(", ")));
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

updateGerente();
