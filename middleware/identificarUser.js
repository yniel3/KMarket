import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

async function identificarUser(req, res, next) {
    // verificar si hay algun token en las cookies
    const { _token } = req.cookies;
    if (!_token) {
        req.usuario = null;
        return next();
    }
    //comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope("eliminarPassword").findByPk(decoded.id);
        if(usuario) {
            req.usuario = usuario
        }
        // pasamos a la siguiente ruta
        return next();
    } catch (error) {
        console.log(error)
        return res.clearCookie("_token").redirect("/auth/login")
    }
}

export default identificarUser;
