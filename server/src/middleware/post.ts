import { body } from "express-validator";

const GENEROS = ['novela','romance','cienciaFiccion','terror','infantil','fantasia','otro'] as const;

export const post = [
  body("titulo")
    .notEmpty().withMessage("El titulo es requerido"),

  body("autor")
    .notEmpty().withMessage("El autor es requerido"),

  body("isbn")
    .notEmpty().withMessage("El ISBN es requerido")
    .isString().withMessage("El ISBN debe ser texto")
    .isLength({ max: 30 }).withMessage("El ISBN excede la longitud"),

  body("editorial")
    .notEmpty().withMessage("La editorial es requerida"),

  body("genero")
    .optional()
    .isIn(GENEROS).withMessage("Genero inválido"),

  body("anioPublicacion")
    .optional()
    .custom(v => /^\d{4}$/.test(String(v))).withMessage("anioPublicacion debe tener 4 dígitos")
    .toInt(),

  body("disponible")
    .optional()
    .isBoolean().withMessage("disponible debe ser booleano")
    .toBoolean(),

  body("sinopsis")
    .optional()
    .isString(),
];
