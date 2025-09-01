import { body } from "express-validator";

const GENEROS = ['novela','romance','cienciaFiccion','terror','infantil','fantasia','otro'] as const;

export const put = [
  body("id").not().exists().withMessage("No se puede actualizar el id"),

  body("titulo").optional().isString().notEmpty(),
  body("autor").optional().isString().notEmpty(),
  body("isbn").optional().isString().isLength({ max: 30 }),
  body("editorial").optional().isString().notEmpty(),
  body("sinopsis").optional().isString(),
  body("genero").optional().isIn(GENEROS).withMessage("Genero invalido"),
  body("anioPublicacion")
    .optional()
    .custom(v => /^\d{4}$/.test(String(v))).withMessage("anioPublicacion debe tener 4 dígitos")
    .toInt(),
  body("disponible").optional().isBoolean().toBoolean(),
];
