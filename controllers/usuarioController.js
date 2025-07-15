import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, emailResetPassword } from "../helpers/emails.js";
// import csurf from "csurf";

async function autenticarUser(req, res) {
    //validacion
    await check("email").isEmail().withMessage("Email incorrecto").run(req);
    await check("password").notEmpty().withMessage("el password es obligatorio").run(req);
    //verficando el resultado
    let resultado = validationResult(req);

    if(!resultado.isEmpty()) {
        //Errores
        return res.render("auth/login", {
            pagina: "Iniciar secion",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
        
    }
    // comprobar si el user existe
    const { email, password } = req.body;
    const usuario = await Usuario.findOne( { where: { email } } );
    if(!usuario) {
        //Errores
        return res.render("auth/login", {
            pagina: "Iniciar secion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "el usuario no existe."}]
        })
    }
    //comprobar si el user esta confirmado
    if(!usuario.confirmado) {
        //Errores
        return res.render("auth/login", {
            pagina: "Iniciar secion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "tu cuenta no ha sido confirmada"}]
        })
    }
    //comprobar el password del user
    if(!usuario.verificarPassword(password)) {
        return res.render("auth/login", {
            pagina: "Iniciar secion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El password es incorrecto"}]
        })
    }
    //autenticar al user
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
    //almecenar en los cookies
    return res.cookie("_token", token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true 
    }).redirect("/perfil")
}

const formularioLogin = (req, res) => {
    res.render(("auth/login"), {
        pagina: "Login",
        csrfToken: req.csrfToken()
    })
}

function cerrarSesion(req, res) {
    return res.clearCookie("_token").status(200).redirect("/auth/login")
}

const formularioRegistro = (req, res) => {

    console.log(req.csrfToken())
    res.render(("auth/registro"), {
        pagina: "Registrarse",
        csrfToken: req.csrfToken()
    })
}

async function registrar(req, res) {
    let resultado;
    //validacion con express-validator
    await check("nombre").notEmpty().withMessage("Nombre vacio").run(req);
    await check("email").isEmail().withMessage("Email incorrecto").run(req);
    await check("password").isLength({min:6}).withMessage("el password es muy devil").run(req);
    await check("confirmPassword").equals(req.body.password).withMessage("passwords diferentes").run(req);

    resultado = validationResult(req);

    if(!resultado.isEmpty()) {
        //Errores
        return res.render("auth/registro", {
            pagina: "Registrarse",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
        
    }
    //extraer datos
    const { nombre, email, password} = req.body;
    //Verificar que el usuario no este duplicado
    const existeUser = await Usuario.findOne({ where: { email: req.body.email}});
    if(existeUser) {
        return res.render("auth/registro", {
            pagina: "Registrarse",
            csrfToken: req.csrfToken(),
            errores: [{msg: "Correo ya esta en uso"}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    // Guardar el usuario en la DB
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })
    //enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render("templates/mensaje", {
        pagina: "Verificacion",
        mensaje: "Hola mundo"
    })
}

//Comprobar cuenta
async function confirmarUser(req, res) {
    // Extraer la variable token
    const { token } = req.params;
    //Verificar token
    const usuario = await Usuario.findOne({where: {token}});
    // si el token es falso
    if(!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al confirmar",
            mensaje: "Hubo un error",
            error: true
        })
    }
    //confirmar el token
    usuario.token = null;
    usuario.confirmado = true;
    // Guardar con el ORM;
    await usuario.save();
    
    return res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta confirmada",
        mensaje: "Cuenta verificada correctamente"
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render(("auth/olvide-password"), {
        pagina: "Recuperar contraseña",
        csrfToken: req.csrfToken(),
    })
}
//olvide password
async function resetPassword(req, res) {
    //validacion con express-validator solo el email
    await check("email").isEmail().withMessage("Email incorrecto").run(req);
    // revisamos que sea un email
    let resultado = validationResult(req);
    // verficar que el resultado no este vacio 
    if(!resultado.isEmpty()) {
        //Errores
        return res.render("auth/olvide-password", {
            pagina: "olvide-password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
        
    }
    //buscar el usuario
    const { email } = req.body;

    const usuario = await Usuario.findOne( {where: { email } } );
    if(!usuario) {
        //Errores
        return res.render("auth/olvide-password", {
            pagina: "olvide-password",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El email no pertenece a ningun usuario"}]
        })
        
    }

    //general un token y enviar el email
    usuario.token = generarId();
    await usuario.save();
    // enviar un email
    emailResetPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    //mostrar mensaje de confirmacion
    res.render("templates/mensaje", {
        pagina: "Reset Password",
        mensaje: "hemos enviado un email para restablecer tu password"
    })
}

async function comprobarElToken(req, res) {
    
    const { token } = req.params;

    const usuario = await Usuario.findOne({where: {token}});

    if(!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: "restablece tu password",
            mensaje: "Hubo un error al restablecer tu password",
            error: true
        })
    }
    //mostrar formulario para crear nueva contraseña
    res.render("auth/reset-password", {
        pagina: "restablece tu password",
        csrfToken: req.csrfToken()

    })

}

async function nuevoPassword(req, res) {
    // validar el password 
    await check("password").isLength({min:6}).withMessage("el password es muy devil").run(req);
    await check("confirmPassword").equals(req.body.password).withMessage("los passwords no coinsiden").run(req);
    // verficar si el campo esta vacio
    let resultado = validationResult(req);
    if(!resultado.isEmpty()) {
        //Errores
        return res.render("auth/reset-password", {
            pagina: "Restablece tu password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
        
    }
    const { token } = req.params;
    const { password } = req.body;
    //identificar quien hace el cambio
    const usuario = await Usuario.findOne( {where: { token }} );
    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;
    //guardar cosas
    await usuario.save()
    // mostrar vista
    res.render("auth/confirmar-cuenta", {
        pagina: "Password restablecido",
        mensaje: "El password se cambio con exito"
    })

}

export {
    formularioLogin,
    cerrarSesion,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmarUser,
    resetPassword,
    nuevoPassword,
    comprobarElToken,
    autenticarUser
}