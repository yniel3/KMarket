import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import "dotenv/config";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import mainContentRoutes from "./routes/mainContentRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import apiRoutes from "./routes/apiRoutes.js"
import db from "./config/dataBase.js";


// crear app 
const app = express();
//habilitar la lectura de los formularios
app.use( express.urlencoded( {extended: true} ) );
//habilitar Cookie-Parser
app.use( cookieParser() );
//Habilitar el CSRF
app.use( csrf( { cookie: true} ) );

//Conectando a la Base de Datos
try {
    await db.authenticate();
    db.sync()
    console.log("Conexion correcta a la Base de Datos")
} catch (error) {
    console.log(error)
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");
//carpeta publica para cosas
app.use( express.static("public") );
// rutas
app.use("/", appRoutes);
app.use("/auth", usuarioRoutes);
app.use("/", mainContentRoutes);
app.use("/api", apiRoutes)
//puerto y arrancar el proyecto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server conectado desde el server ${PORT}`)
})

