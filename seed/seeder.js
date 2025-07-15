import { exit } from "node:process";
// import Precio from "../models/Precio.js";
import precios from "./precios.js";
// import Categoria from "../models/Categoria.js";
import categorias from "./categorias.js";
import usuarios from "./usuarios.js";
import db from "../config/dataBase.js";
import { Categoria, Precio, Usuario } from "../models/index.js";



async function importarDatos() {
    try {
        // autenticar
        await db.authenticate();
        // generar las columnas
        await db.sync();
        // insertar los datos
        // await Categoria.bulkCreate(categorias);
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])
        console.log("datos importados correctamente");
        exit();
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

async function eliminarDatos() {
    try {
        // primera forma de limpiar las tablas
        // await Promise.all([
        //     Categoria.destroy( { where: {}, truncate: true } ),
        //     Precio.destroy( { where: {}, truncate: true } ),
        // ])
        // segunda forma de limpiar las tablas
        await db.sync( { force: true } );
        console.log("Datos eliminados correctamente");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}



if(process.argv[2] === "-i") {
    importarDatos();
}
if(process.argv[2] === "-e") {
    eliminarDatos();
}