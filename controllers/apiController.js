import { Articulo, Precio, Categoria } from "../models/index.js";

async function articulos(req, res) {
    const publaciones = await Articulo.findAll({
        include: [
            {model: Precio, as: "precio"},
            {model: Categoria, as: "categoria"}
        ]
    })

    res.json(publaciones)
}

export {
    articulos
}