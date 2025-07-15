import express from "express";
import { articulos } from "../controllers/apiController.js";

const router = express.Router();

router.get("/publicaciones", articulos);


export default router
