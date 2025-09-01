import { Request, Response } from "express";
import colors from "colors";

import Libro from "../models/Libro.mo";

export const createLibro = async (req: Request, res: Response) => {
  try {
    const { titulo, isbn } = req.body;

    if (titulo) {
      const tituloExistente = await Libro.findOne({ where: { titulo } });
      if (tituloExistente)
        return res
          .status(400)
          .json({ error: "El libro con ese titulo ya existe" });
    }

    if (isbn) {
      const isbnExistente = await Libro.findOne({ where: { isbn } });
      if (isbnExistente)
        return res
          .status(400)
          .json({ error: "El libro con ese ISBN ya existe" });
    }

    const libro = await Libro.create(req.body);
    res.status(201).json({ data: libro });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al crear el libro"));
  }
};

export const getLibros = async (req: Request, res: Response) => {
  try {
    const {titulo, page = 1, limit = 10} = req.query as any;

    const where: any = {};
    if(titulo) where.titulo = titulo;

    const libros = await Libro.findAll({
      where,
      order: [["genero", "ASC"]],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    });

    res.json({ data: libros });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al obtner libros"));
  }
};

export const getLibrosId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idp = Number(id);

    if (!Number.isInteger(idp) || idp <= 0) {
      return res.status(400).json({ error: "El id es invalido" });
    }
    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json({ data: libro });
  } catch (error) {
    console.log(
      colors.white.bgRed.bold("Hubo un error al obtener el libro por id")
    );
  }
};

export const updateLibro = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idp = Number(id);

  if (!Number.isInteger(idp) || idp <= 0) {
    return res.status(400).json({ error: "El id es invalido" });
  }
  const libro = await Libro.findByPk(id);
  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  if (req.body.id !== undefined) {
      return res.status(400).json({ error: "No se puede actualizar el id" });
    }

  await libro.update(req.body);
  res.json({ data: libro });
};

export const updateDisponibilidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idp = Number(id);

    if (!Number.isInteger(idp) || idp <= 0) {
      return res.status(400).json({ error: "El id es invalido" });
    }

    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    libro.disponible = !libro.disponible;
    await libro.save();

    res.json({ data: libro });
  } catch (error) {
    console.log(
      colors.white.bgRed.bold("Hubo un error al editar el campo disponible")
    );
  }
};


export const deleteLibro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idp = Number(id);

    if (!Number.isInteger(idp) || idp <= 0) {
      return res.status(400).json({ error: "El id es invalido" });
    }

    const libro = await Libro.findByPk(id);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await libro.destroy(req.body);

    res.json({ message: "Libro eliminado" });
  } catch (error) {
    console.log(colors.white.bgRed.bold("Hubo un error al eliminar el Libro"));
  }
};
