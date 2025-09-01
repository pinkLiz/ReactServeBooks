import { Router } from "express";
import {
  createLibro,
  updateDisponibilidad,
  updateLibro,
  getLibros,
  getLibrosId,
  deleteLibro,
} from "./handlers/libro";

import { post } from "./middleware/post";
import { put } from "./middleware/put";
import { eliminar } from "./middleware/delete";
import { methods } from "./middleware/methods";
import { handleInputErrors } from "./middleware";

import { param } from "express-validator";

const router = Router();

router.use(methods);

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 20
 *         titulo:
 *           type: string
 *           example: "Cien años de soledad"
 *         autor:
 *           type: string
 *           example: "Gabriel García Marquez"
 *         genero:
 *           type: string
 *           enum: [novela, romance, cienciaFiccion, terror, infantil, fantasia, otro]
 *           example: "novela"
 *         isbn:
 *           type: string
 *           example: "9780307474278"
 *         editorial:
 *           type: string
 *           example: "Sudamericana"
 *         sinopsis:
 *           type: string
 *           example: "Una de las obras cumbre del realismo magico..."
 *         anioPublicacion:
 *           type: integer
 *           description: Año con 4 dígitos
 *           example: 1967
 *         disponible:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtener todos los libros
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtro por titulo 
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de libros
 */

/**
 * @swagger
 * /api/libros/{id}:
 *   get:
 *     summary: Obtener libro por Id
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags:
 *       - Libros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro creado
 */

/**
 * @swagger
 * /api/libros/{id}:
 *   put:
 *     summary: Actualizar un libro por Id
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del libro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       400:
 *         description: No se puede actualizar el Id 
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /api/libros/{id}/disponibilidad:
 *   patch:
 *     summary: Cambiar disponibilidad del libro
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del libro
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada
 *       404:
 *         description: Libro no encontrado
 */

/**
 * @swagger
 * /api/libros/{id}:
 *   delete:
 *     summary: Eliminar un libro por Id
 *     tags:
 *       - Libros
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del libro a eliminar
 *     responses:
 *       200:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 */

router.get("/libros", getLibros);

router.get(
  "/libros/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  getLibrosId
);

router.post("/libros", post, handleInputErrors, createLibro);

router.put(
  "/libros/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  put,
  handleInputErrors,
  updateLibro
);

router.patch(
  "/libros/:id/disponibilidad",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  updateDisponibilidad
);

router.delete(
  "/libros/:id",
  param("id").isNumeric().withMessage("El id debe ser numerico"),
  handleInputErrors,
  eliminar,
  deleteLibro
);

export default router;
