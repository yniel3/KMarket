import { DataTypes } from "sequelize";
import db from "../config/dataBase.js"

const Mensaje = db.define("mensajes", {
    mensaje: {
        type: DataTypes.STRING(300),
        allowNull: false
    }
});

export default Mensaje;