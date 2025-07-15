import { Sequelize } from "sequelize";
import { Precio, Categoria, Articulo } from "../models/index.js";


async function inicio(req, res) {
    let usuarioValido;
    if(req.cookies._token) {
        usuarioValido = true;
    }
    const [categorias, precios, categoriaUno, categoriaDos] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Articulo.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: "precio"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        }),
        Articulo.findAll({
            limit: 3,
            where: {
                categoriaId: 6
            },
            include: [
                {
                    model: Precio,
                    as: "precio"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        })
    ])
    // const usuarioValido = req.cookie._token;
    // console.log(usuarioValido)
    res.render("inicio", {
        pagina: "Inicio",
        categorias,
        precios,
        categoriaUno,
        categoriaDos,
        csrfToken: req.csrfToken(),
        barraCategorias: false,
        usuarioValido
    })
}

async function categoria(req, res) {
    let usuarioValido;
    if(req.cookies._token) {
        usuarioValido = true;
    }
    const { id } = req.params;
    //comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        return res.redirect("/404");
    }
    //Obtener las publicaciones de la categoria
    const publicaciones = await Articulo.findAll({
        where: {
            categoriaId: id
        },
        include: [
            { model: Precio, as: "precio"},
            { model: Categoria, as: "categoria"}
        ]
    })
    if (publicaciones.length === 0) {
        return res.redirect("/404");
    }
    res.render("categoria", {
        pagina: "Market",
        publicaciones,
        barraCategorias: true,
        csrfToken: req.csrfToken(),
        usuarioValido
    })
}

const noEncontrado = (req, res) => {
    let usuarioValido;
    if(req.cookies._token) {
        usuarioValido = true;
    }
    res.render("404", {
        pagina: "Market",
        csrfToken: req.csrfToken(),
        barraCategorias: true,
        usuarioValido
    })
}

async function buscador(req, res) {
    let usuarioValido;
    if(req.cookies._token) {
        usuarioValido = true;
    }
    //Debes crear ==> termino para el buscador
    const { termino } = req.body;

    if(!termino.trim()) {
        return res.redirect("..");
    }

    //Debes crear ==> termino para el buscador
    const publicaciones = await Articulo.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : "%" + termino + "%"
            }
        },
        include: [
            { model: Precio, as: "precio"}
        ]
    })

    res.render("busqueda", {
        pagina: "Market",
        publicaciones,
        csrfToken: req.csrfToken(),
        barraCategorias: true,
        usuarioValido
    })
}


export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}