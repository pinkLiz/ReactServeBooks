import request from 'supertest';
import server from '../../server';
import db from '../../config/db';
import Libro from '../../models/Libro.mo';

import {
  createLibro,
  getLibros,
  getLibrosId,
  updateDisponibilidad,
  deleteLibro,
  updateLibro,
} from '../libro';


type Genero = 'novela' | 'romance' | 'cienciaFiccion' | 'terror' | 'infantil' | 'fantasia' | 'otro';

type libros = {
  titulo: string;
  autor: string;
  genero: Genero;
  isbn: string;
  editorial: string;
  anioPublicacion: number;
  sinopsis: string;
  disponible?: boolean;
};

//Generar los identificadores unicos
const unique = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const Libros: libros[] = [
  {
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'novela',
    isbn: '9780307474278',
    editorial: 'Sudamericana',
    anioPublicacion: 1967,
    sinopsis: 'La saga de los Buendía en Macondo y el realismo mágico.',
  },
  {
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    genero: 'novela',
    isbn: '9788437604947',
    editorial: 'Alfaguara',
    anioPublicacion: 1963,
    sinopsis: 'Novela lúdica y fragmentaria que permite múltiples recorridos.',
  },
  {
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    genero: 'novela',
    isbn: '9789500737499',
    editorial: 'Seix Barral',
    anioPublicacion: 1948,
    sinopsis: 'Un pintor obsesivo relata la historia de un crimen por amor.',
  },
  {
    titulo: 'Pedro Páramo',
    autor: 'Juan Rulfo',
    genero: 'novela',
    isbn: '9786071602052',
    editorial: 'FCE',
    anioPublicacion: 1955,
    sinopsis: 'Un viaje a Comala, pueblo de murmullos y fantasmas.',
  },
  {
    titulo: 'La invención de Morel',
    autor: 'Adolfo Bioy Casares',
    genero: 'cienciaFiccion',
    isbn: '9788420633187',
    editorial: 'Alianza',
    anioPublicacion: 1940,
    sinopsis: 'Un fugitivo descubre una máquina que replica la realidad.',
  },
  {
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    genero: 'fantasia',
    isbn: '9789875668425',
    editorial: 'Emecé',
    anioPublicacion: 1944,
    sinopsis: 'Relatos sobre laberintos, espejos y bibliotecas infinitas.',
  },
  {
    titulo: 'El Aleph',
    autor: 'Jorge Luis Borges',
    genero: 'fantasia',
    isbn: '9789871138205',
    editorial: 'Emecé',
    anioPublicacion: 1949,
    sinopsis: 'Un punto del espacio que contiene todos los puntos.',
  },
  {
    titulo: 'La ciudad y los perros',
    autor: 'Mario Vargas Llosa',
    genero: 'novela',
    isbn: '9788432208898',
    editorial: 'Seix Barral',
    anioPublicacion: 1962,
    sinopsis: 'La vida dura y violenta en un colegio militar de Lima.',
  },
  {
    titulo: 'Como agua para chocolate',
    autor: 'Laura Esquivel',
    genero: 'romance',
    isbn: '9780385420174',
    editorial: 'Doubleday',
    anioPublicacion: 1989,
    sinopsis: 'Recetas, amor prohibido y tradición familiar en la frontera.',
  },
  {
    titulo: 'La sombra del viento',
    autor: 'Carlos Ruiz Zafón',
    genero: 'novela',
    isbn: '9788408163383',
    editorial: 'Planeta',
    anioPublicacion: 2001,
    sinopsis: 'Un misterio literario en el Cementerio de los Libros Olvidados.',
  },
  {
    titulo: 'El amor en los tiempos del cólera',
    autor: 'Gabriel García Márquez',
    genero: 'romance',
    isbn: '9780307389732',
    editorial: 'Vintage',
    anioPublicacion: 1985,
    sinopsis: 'Un amor paciente que atraviesa décadas y epidemias.',
  },
  {
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'infantil',
    isbn: '9780156013987',
    editorial: 'Reynal & Hitchcock',
    anioPublicacion: 1943,
    sinopsis: 'Un piloto conoce a un niño de otro planeta.',
  },
];

// Helpers para escoger libros del arreglo sin repetir
const byTitle = (titulo: string) => {
  const item = Libros.find(b => b.titulo === titulo);
  if (!item) throw new Error(`No existe seed para el título: ${titulo}`);
  return { ...item };
};

let bookIdx = 0;
const nextBook = () => ({ ...Libros[bookIdx++ % Libros.length] });

// Payload base para crear libros (si no pasas overrides, rota por BOOKS)
const libroPayload = (overrides: Partial<libros> = {}) => ({
  ...nextBook(),
  disponible: true,
  ...overrides,
});

// Útil cuando necesitamos “inventar” un ISBN distinto pero verosímil
const withIsbn = (base: string, sufijo: string) =>
  (base + sufijo).slice(0, 30);



afterAll(async () => {
  await db.close();
});

describe('POST /api/libros', () => {
  it('Debe mostrar errores de validacion si el cuerpo esta vacio', async () => {
    const res = await request(server).post('/api/libros');
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('Debe crear el libro si los datos son validos', async () => {
    const res = await request(server).post('/api/libros').send(
      libroPayload(byTitle('Cien años de soledad')),
    );
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.titulo).toBe('Cien años de soledad');
  });

  it('Debe rechazar si el titulo es duplicado', async () => {
    const base = byTitle('Ficciones');
    await request(server).post('/api/libros').send(libroPayload({ ...base, isbn: withIsbn(base.isbn, 'X1') }));
    const dup = await request(server).post('/api/libros').send(libroPayload({ ...base, isbn: withIsbn(base.isbn, 'X2') }));
    expect(dup.status).toBe(400);
  });

  it('Debe rechazar si el isbn es duplicado', async () => {
    const isbn = byTitle('Rayuela').isbn;
    await request(server).post('/api/libros').send(libroPayload({ ...byTitle('Rayuela'), isbn }));
    const dup = await request(server).post('/api/libros').send(libroPayload({ ...byTitle('El Aleph'), isbn }));
    expect(dup.status).toBe(400);
  });

  it('No debe devolver 404 en la peticion', async () => {
    const res = await request(server).post('/api/libros').send(libroPayload());
    expect(res.status).not.toBe(404);
  });
});

describe('GET /api/libros', () => {
  it('Debe devolver status 200', async () => {
    const res = await request(server).get('/api/libros');
    expect(res.status).toBe(200);
  });

  it('Debe devolver datos en formato JSON', async () => {
    const res = await request(server).get('/api/libros');
    expect(res.header['content-type']).toMatch(/json/);
  });

  it('La respuesta debe contener una propiedad llamada data', async () => {
    const res = await request(server).get('/api/libros');
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('La respuesta no debe tener la propiedad errors', async () => {
    const res = await request(server).get('/api/libros');
    expect(res.body.errors).toBeUndefined();
  });
  it('Debe permitir filtrar por el titulo exacto', async () => {
    const t = 'El Aleph';
    await request(server).post('/api/libros').send(libroPayload(byTitle(t)));
    await request(server).post('/api/libros').send(libroPayload(byTitle('La ciudad y los perros')));

    const res = await request(server).get(`/api/libros?titulo=${encodeURIComponent(t)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach((r: any) => expect(r.titulo).toBe(t));
  });
});

describe('GET /api/libros/:id', () => {
  it('Debe retornar 400 si el id no es valido', async () => {
    const res = await request(server).get('/api/libros/hola'); 
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el libro no existe', async () => {
    const res = await request(server).get('/api/libros/999999');
    expect(res.status).toBe(404);
  });

  it('Debe retornar 200 si el id es valido', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('La sombra del viento')));
    const id = creado.body.data.id;

    const res = await request(server).get(`/api/libros/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(id);
  });
});

describe('PUT /api/libros/:id', () => {
  it('Debe validar que el id de la url sea valido', async () => {
    const res = await request(server).put('/api/libros/abc').send({});
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el libro no existe', async () => {
    const res = await request(server).put('/api/libros/999999').send({ titulo: 'Nuevo titulo' });
    expect(res.status).toBe(404);
  });

  it('Debe validar que no se pueda actualizar el id', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('El principito')));
    const id = creado.body.data.id;

    const res = await request(server).put(`/api/libros/${id}`).send({ id: 999, titulo: 'Intento invalido' });
    expect(res.status).toBe(400);
  });

  it('Debe retornar 200 si el libro se actualiza correctamente', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('El túnel')));
    const id = creado.body.data.id;

    const res = await request(server).put(`/api/libros/${id}`).send({
      titulo: 'El túnel 2',
      disponible: false,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.titulo).toBe('El túnel 2');
    expect(res.body.data.disponible).toBe(false);
  });

  it('Debe rechazar el año si no tiene 4 dígitos', async () => {
  const base = byTitle('La ciudad y los perros');

  const creado = await request(server).post('/api/libros').send(
    libroPayload({
      ...base,
      titulo: `${base.titulo} ${unique()}`,
      isbn: withIsbn(base.isbn, `_${unique()}`),
    })
  );

  expect(creado.status).toBe(201); 
  const id = creado.body.data.id;

  const res = await request(server)
    .put(`/api/libros/${id}`)
    .send({ anioPublicacion: 123 }); 
  expect(res.status).toBe(400);
  expect(res.body.errors).toBeDefined();
});

it('Debe aceptar el año con 4 dígitos como string y convertir a numero', async () => {
  const base = byTitle('El amor en los tiempos del cólera');

  const creado = await request(server).post('/api/libros').send(
    libroPayload({
      ...base,
      titulo: `${base.titulo} ${unique()}`,
      isbn: withIsbn(base.isbn, `_${unique()}`),
    })
  );

  expect(creado.status).toBe(201);
  const id = creado.body.data.id;

  const res = await request(server)
    .put(`/api/libros/${id}`)
    .send({ anioPublicacion: '1999' });

  expect(res.status).toBe(200);
  expect(res.body.data.anioPublicacion).toBe(1999);
});
});

describe('PATCH /api/libros/:id/disponibilidad', () => {
  it('Debe retornar 404 si el libro no existe', async () => {
    const res = await request(server).patch('/api/libros/999999/disponibilidad');
    expect(res.status).toBe(404);
  });

  it('Debe retornar 200 si se cambia correctamente la disponibilidad', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('Pedro Páramo')));
    const id = creado.body.data.id;

    const res = await request(server).patch(`/api/libros/${id}/disponibilidad`);
    expect(res.status).toBe(200);
    expect(res.body.data.disponible).toBe(false);
  });

  it('Debe alternar disponibilidad true -> false -> true', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('Como agua para chocolate')));
    const id = creado.body.data.id;

    const res1 = await request(server).patch(`/api/libros/${id}/disponibilidad`);
    const res2 = await request(server).patch(`/api/libros/${id}/disponibilidad`);

    expect(res1.body.data.disponible).toBe(false);
    expect(res2.body.data.disponible).toBe(true);
  });
});

describe('DELETE /api/libros/:id', () => {
  it('Debe retornar 400 si el id no es válido', async () => {
    const res = await request(server).delete('/api/libros/abc');
    expect(res.status).toBe(400);
  });

  it('Debe retornar 404 si el libro no existe', async () => {
    const res = await request(server).delete('/api/libros/999999');
    expect(res.status).toBe(404);
  });

  it('Debe eliminar correctamente el libro', async () => {
    const creado = await request(server).post('/api/libros').send(libroPayload(byTitle('La invención de Morel')));
    const id = creado.body.data.id;

    const res = await request(server).delete(`/api/libros/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});

describe('Errores de Libros', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Error al crear el libro', async () => {
    jest.spyOn(Libro, 'create').mockRejectedValueOnce(new Error('Hubo un error al crear el libro'));
    const consoleSpy = jest.spyOn(console, 'log');

    const req = { body: {} } as any;
    const res = { status: jest.fn().mockReturnThis() } as any;

    await createLibro(req, res);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hubo un error al crear el libro'));
  });

  it('Error al obtener los libros', async () => {
    jest.spyOn(Libro, 'findAll').mockRejectedValueOnce(new Error('Hubo un error al obtner libros'));
    const consoleSpy = jest.spyOn(console, 'log');

    const req = { query: {} } as any;
    const res = { status: jest.fn().mockReturnThis() } as any;

    await getLibros(req, res);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Hubo un error al obtner libros'));
  });

  it('Error al obtner libro por el id ', async () => {
    jest.spyOn(Libro, 'findByPk').mockRejectedValueOnce(
      new Error('Hubo un error al obtener el libro por id'),
    );
    const consoleSpy = jest.spyOn(console, 'log');

    const req = { params: { id: '1' } } as any;
    const res = { status: jest.fn().mockReturnThis() } as any;

    await getLibrosId(req, res);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al obtener el libro por id'),
    );
  });

  it('Error al cambiar el campo disponibilidad', async () => {
    jest
      .spyOn(Libro, 'findByPk')
      .mockRejectedValueOnce(new Error('Hubo un error al editar el campo disponible'));
    const consoleSpy = jest.spyOn(console, 'log');

    const req = { params: { id: '1' } } as any;
    const res = { status: jest.fn().mockReturnThis() } as any;

    await updateDisponibilidad(req, res);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al editar el campo disponible'),
    );
  });

  it('Error al eliminar el libro', async () => {
    jest.spyOn(Libro, 'findByPk').mockRejectedValueOnce(new Error('Hubo un error al eliminar el Libro'));
    const consoleSpy = jest.spyOn(console, 'log');

    const req = { params: { id: '1' } } as any;
    const res = { status: jest.fn().mockReturnThis() } as any;

    await deleteLibro(req, res);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al eliminar el Libro'),
    );
  });
});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Errores de hanlders', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('Error en la funcion de getLibrosId', async () => {
    const req: any = { params: { id: '0' } };
    const res = mockRes();

    await getLibrosId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El id es invalido' });
  });

  it('Error en la funcion de updateLibro', async () => {
    const req: any = { params: { id: '0' }, body: {} };
    const res = mockRes();

    await updateLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El id es invalido' });
  });

  it('Error en la funcion de updateLibro', async () => {
    jest.spyOn(Libro, 'findByPk').mockResolvedValueOnce({ update: jest.fn() } as any);

    const req: any = { params: { id: '1' }, body: { id: 999, titulo: 'X' } };
    const res = mockRes();

    await updateLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No se puede actualizar el id' });
  });

  it('Error en la funcion de updateDisponibilidad', async () => {
    const req: any = { params: { id: '0' } };
    const res = mockRes();

    await updateDisponibilidad(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El id es invalido' });
  });

  it('Error en la funcion de deleteLibro', async () => {
    const req: any = { params: { id: '0' } };
    const res = mockRes();

    await deleteLibro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El id es invalido' });
  });
});
