export type Genero =
  | "novela"
  | "romance"
  | "cienciaFiccion"
  | "terror"
  | "infantil"
  | "fantasia"
  | "otro";

export type Libro = {
  id?: number;
  titulo: string;
  autor: string;
  genero: Genero;
  isbn: string;
  editorial: string;
  sinopsis?: string;
  anioPublicacion?: number;
  disponible?: boolean;
};


export type FormProps = {
  initialData?: Libro;
  onSubmit: (book: Libro) => void;
  submitText: string;
};

