import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Precio, Categoria, Articulo, Mensaje, Usuario} from "../models/index.js";
import { esVendedor, formatearFecha } from "../helpers/index.js";


async function admin(req, res) {
    //extraigo la pagina y la renombro;
    const { pagina: paginaActual } = req.query;
    // decaramos una expresion regular
    const expresion = /^[0-9]$/
    if (!expresion.test(paginaActual)) {
        return res.redirect("/perfil?pagina=1")
    }
    try {
        //extraemos el usuario
        const { id } = req.usuario;
        //limites y Offset para el paginador
        const limit = 5;
        const offset = ((paginaActual * limit) - limit);
        // pasamos los articulos publicados
        const [articulos, total] = await Promise.all([
            Articulo.findAll({
                limit: limit,
                offset: offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: "categoria"},
                    { model: Precio, as: "precio"},
                    { model: Mensaje, as: "mensajes"},
                ]
            }),
            Articulo.count({
                where: {
                    usuarioId: id
                }
            })
        ])
        const usuarioName = await Usuario.findByPk(id);
        res.render("main/perfil", {
            pagina: "tu-perfil",
            articulos,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual,
            total,
            offset,
            limit,
            nombreUser: usuarioName.nombre
        })
    } catch (error) {
        console.log(error)
    }
}
// form para publicar articulos
async function publicar(req, res) {
    // consultar modelo de categoria y precio
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    res.render("main/publicar", {
        pagina: "Tu-perfil",
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

async function guardar(req, res) {
    // Validar
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render("main/publicar", {
            pagina: "perfil-publicar",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
        
    }
    //====> crear el registro <======//
    //extraer los valores de req.body
    const { titulo, descripcion, precio, categoria, calle, lat, lng } = req.body;
    const { id: usuarioId } = req.usuario;

    try {
        const articuloGuardado = await Articulo.create({
            titulo,
            descripcion,
            precioId: precio,
            categoriaId: categoria,
            calle,
            lat,
            lng,
            usuarioId,
            imagen: ""
        })
        const { id } = articuloGuardado;
        res.redirect(`/perfil/publicar-imagen/${id}`);
    } catch (error) {
        console.log(error)
    }
}

async function agregarImagen(req, res) {
    //obtenemos el id de los parametros del req
    const { id } = req.params;
    //validar que el articulo exista
    const articulo = await Articulo.findByPk(id);
    if(!articulo) {
        return res.redirect("/perfil");
    }
    // validar que el articulo no este publicado.
    if(articulo.publicado) {
        return res.redirect("/perfil");
    }
    //validar que el articulo pertenece a quien visita esta pagina
    if(req.usuario.id.toString() !== articulo.usuarioId.toString()) {
        return res.redirect("/perfil");
    }

    res.render("main/publicar-imagen", {
        pagina: "agregar imagen",
        csrfToken: req.csrfToken(),
        articulo
    });
}

async function alemacenarImagen(req, res, next) {
    //obtenemos el id de los parametros del req
    const { id } = req.params;
    //validar que el articulo exista
    const articulo = await Articulo.findByPk(id);
    if(!articulo) {
        return res.redirect("/perfil");
    }
    // validar que el articulo no este publicado.
    if(articulo.publicado) {
        return res.redirect("/perfil");
    }
    //validar que el articulo pertenece a quien visita esta pagina
    if(req.usuario.id.toString() !== articulo.usuarioId.toString()) {
        return res.redirect("/perfil");
    }
    try {
        console.log(req.file);
        // almacenar la imagen y publicar el articulo
        articulo.imagen = req.file.filename;
        articulo.publicado = 1;
        //lo alemacena en la base de datos
        await articulo.save();
        //enviamos al siguiente middleware
        next()

    } catch (error) {
        console.log(error)
    }
}

async function editar(req, res) {
    // extraemos el id de la publicacion
    const { id } = req.params;
    // validar que la publicacion exista
    const publicacion = await Articulo.findByPk(id);
    if (!publicacion) {
        return res.redirect("/perfil")
    }
    if (publicacion.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/perfil")
    }
    // consultar modelo de categoria y precio
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    res.render("main/editar", {
        pagina: "Editar",
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: publicacion
    })
}

async function guardarCambios(req, res) {
    // verificar la validacion
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        return res.render("/editar", {
            pagina: "Editar",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            datos: req.body
        })
        
    }
    // extraemos el id de la publicacion
    const { id } = req.params;
    // validar que la publicacion exista
    const publicacion = await Articulo.findByPk(id);
    if (!publicacion) {
        return res.redirect("/perfil")
    }
    if (publicacion.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/perfil")
    }
    // reescribir el objeto y actualizarlo
    try {
        //extraer los valores de req.body
        const { titulo, descripcion, precio: precioId, categoria: categoriaId, calle, lat, lng } = req.body;
        publicacion.set({
            titulo,
            descripcion,
            precioId,
            categoriaId,
            calle,
            lat,
            lng
        })
        // guardamos la propiedad
        await publicacion.save()
        res.redirect("/perfil");
    } catch (error) {
        console.log(error)
    }
}

async function eliminar(req, res) {
    // extraemos el id de la publicacion
    const { id } = req.params;
    // validar que la publicacion exista
    const publicacion = await Articulo.findByPk(id);
    if (!publicacion) {
        return res.redirect("/perfil")
    }
    if (publicacion.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/perfil")
    }
    // eliminar imagen asociada
    await unlink(`public/uploads/${publicacion.imagen}`)
    // eliminar la publicacion
    await publicacion.destroy();
    res.redirect("/perfil")
}
//modificar estado publico o oculto
async function cambiarEstado(req, res) {
    // extraemos el id de la publicacion
    const { id } = req.params;
    // validar que la publicacion exista
    const publicacion = await Articulo.findByPk(id);
    if (!publicacion) {
        console.log("No existe esta mmd wey")
        return res.redirect("/perfil")
    }
    if (publicacion.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/perfil")
    }
    //actualizar el estado de la publicacion
    publicacion.publicado = !publicacion.publicado;
    //guardar cambios
    await publicacion.save();
    res.json({
        resultado: "ok"
    })
}

async function mostrarPublicacion(req, res) {
    const { id } = req.params;
    // comprovar que la publicacion existe
    const publicacion = await Articulo.findByPk(id, {
        include: [
            {model: Precio, as: "precio"},
            {model: Categoria, as: "categoria"}
        ]
    });
    if (!publicacion || !publicacion.publicado) {
        return res.redirect("/404")
    }
    
    res.render("main/mostrar", {
        publicacion,
        pagina: "Market",
        barraCategorias: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, publicacion.usuarioId)
    })
}

async function enviarMensaje(req, res) {
    const { id } = req.params;
    // comprovar que la publicacion existe
    const publicacion = await Articulo.findByPk(id, {
        include: [
            {model: Precio, as: "precio"},
            {model: Categoria, as: "categoria"}
        ]
    });
    if (!publicacion) {
        return res.redirect("/404")
    }
    // renderizar los errores
    //==========> Validar
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
            return res.render("main/mostrar", {
            publicacion,
            pagina: publicacion.titulo,
            barraCategorias: true,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, publicacion.usuarioId),
            errores: resultado.array()
        })
    }
    //extraer valores del req
    const { mensaje } = req.body;
    const { id: articuloId } = req.params;
    const { id: usuarioId } = req.usuario;
    //almacenar el mensaje
    await Mensaje.create({
        mensaje,
        articuloId,
        usuarioId
    })

    res.redirect("/")
}
// leer mensajes recibidos
async function verMensajes(req, res) {
      // extraemos el id de la publicacion
    const { id } = req.params;
    // validar que la publicacion exista
    const publicacion = await Articulo.findByPk(id, {
        include: [
            { model: Mensaje, as: "mensajes",
                include: [
                    { model: Usuario.scope("eliminarPassword"), as: "usuario"}
                ]
            }
        ]
    });
    if (!publicacion) {
        console.log("No existe esta mmd wey")
        return res.redirect("/perfil")
    }
    if (publicacion.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect("/perfil")
    }

    res.render("main/mensajes", {
        pagina: "Mensajes",
        mensajes: publicacion.mensajes,
        formatearFecha
    })
}

export {
    admin,
    publicar,
    guardar,
    agregarImagen,
    alemacenarImagen,
    editar,
    eliminar,
    cambiarEstado,
    guardarCambios,
    mostrarPublicacion,
    enviarMensaje,
    verMensajes
}