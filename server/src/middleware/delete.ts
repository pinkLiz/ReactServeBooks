import { param } from "express-validator";

export const eliminar = [
  param("id").isInt({ gt: 0 }).withMessage("El id debe ser numerico y > 0"),
];
