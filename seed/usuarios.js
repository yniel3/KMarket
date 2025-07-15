import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: "kobe",
        email: "kobe@gato.master",
        confirmado: 1,
        password: bcrypt.hashSync("password", 10)
    },
    {
        nombre: "brida",
        email: "brida@gato.css",
        confirmado: 1,
        password: bcrypt.hashSync("password", 10)
    }
]

export default usuarios;