import express from "express";
import { 
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
} from "../controllers/usuarioController.js";




// instanciando express a mi ruta 
const router = express.Router();
router.get("/login", formularioLogin );
router.post("/login", autenticarUser );
//cerrar sesion del usuario
router.post("/cerrar-sesion", cerrarSesion);

router.get("/registro", formularioRegistro );
router.post("/registro", registrar );

router.get("/confirmar/:token", confirmarUser );
router.get("/olvide-password", formularioOlvidePassword );
router.post("/olvide-password", resetPassword );
// almacenar el nuevo password 
router.get("/olvide-password/:token", comprobarElToken );
router.post("/olvide-password/:token", nuevoPassword );


// router.post("/" ,(req, res) => {
//     res.json({msg: "metodo post: enviendo"})
// })

// router.route("/")
//     .get((req, res) => {
//         res.json({msg: "Hola perdedor"})
//     })
//     .post((req, res) => {
//         res.json({msg: "Enviendo algo nc!"})
//     })

export default router
