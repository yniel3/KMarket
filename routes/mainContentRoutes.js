import express from "express";
import { body } from "express-validator";
import { admin, publicar, guardar, agregarImagen, alemacenarImagen, editar, eliminar, cambiarEstado, guardarCambios, mostrarPublicacion, enviarMensaje, verMensajes } from "../controllers/mainContentController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUser from "../middleware/identificarUser.js";

const router = express.Router();

router.get("/perfil", protegerRuta, admin);
router.get("/perfil/publicar", protegerRuta, publicar);
router.post("/perfil/publicar", protegerRuta,
    body("titulo").notEmpty().withMessage("el titulo no debe de ir vacio"),
    body("descripcion")
        .notEmpty().withMessage("Debes colocar una descripcion")
        .isLength( { max: 500} ).withMessage("Descripcion muy larga."),
    body("categoria").isNumeric().withMessage("Selecciona una categoria."),
    body("precio").isNumeric().withMessage("Coloca un rango de precio para el articulo"),
    body("lat").notEmpty().withMessage("Marca una ubicacion."),
    guardar
);

router.get("/perfil/publicar-imagen/:id", protegerRuta, agregarImagen);
router.post("/perfil/publicar-imagen/:id", protegerRuta, upload.single("imagen"), alemacenarImagen);

router.get("/perfil/editar/:id", protegerRuta, editar);
router.post("/perfil/editar/:id", protegerRuta,
    body("titulo").notEmpty().withMessage("el titulo no debe de ir vacio"),
    body("descripcion")
        .notEmpty().withMessage("Debes colocar una descripcion")
        .isLength( { max: 500} ).withMessage("Descripcion muy larga."),
    body("categoria").isNumeric().withMessage("Selecciona una categoria."),
    body("precio").isNumeric().withMessage("Coloca un rango de precio para el articulo"),
    body("lat").notEmpty().withMessage("Marca una ubicacion."),
    guardarCambios
);
router.post("/perfil/eliminar/:id", protegerRuta, eliminar);

router.put("/perfil/:id", protegerRuta, cambiarEstado)

// Area publica
router.get("/mostrar/:id",
    identificarUser,
    mostrarPublicacion
);
//Almacenar mensajes
router.post("/mostrar/:id",
    identificarUser,
    body("mensaje").isLength({ min: 10 }).withMessage("el mensaje esta vacio o es muy corto"),
    enviarMensaje
);

router.get("/mensajes/:id", 
    protegerRuta,
    verMensajes
)

export default router;