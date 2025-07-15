import Articulo from "./Articulos.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Precio from "./Precio.js";
import Mensaje from "./Mensaje.js";

Articulo.belongsTo(Precio, { foreignKey: "precioId" });
Articulo.belongsTo(Categoria, { foreignKey: "categoriaId" });
Articulo.belongsTo(Usuario, { foreignKey: "usuarioId" });
Articulo.hasMany(Mensaje, { foreignKey: "articuloId" });


Mensaje.belongsTo(Articulo, { foreignKey: "articuloId"});
Mensaje.belongsTo(Usuario, { foreignKey: "usuarioId"});


export {
    Precio,
    Articulo,
    Categoria,
    Usuario,
    Mensaje
}