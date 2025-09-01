// src/components/LibroForm.tsx
import { useEffect, useState } from "react";
import type { Libro, Genero } from "../types/types";

type Props = {
  initialData?: Libro;
  submitText: string;
  onSubmit: (book: Libro) => void | Promise<void>;
};

const EMPTY: Libro = {
  titulo: "",
  autor: "",
  genero: "novela",
  isbn: "",
  editorial: "",
  sinopsis: "",
  anioPublicacion: undefined,
  disponible: true,
};

const GENEROS: Genero[] = [
  "novela",
  "romance",
  "cienciaFiccion",
  "terror",
  "infantil",
  "fantasia",
  "otro",
];

export default function LibroForm({ initialData, submitText, onSubmit }: Props) {
  const [form, setForm] = useState<Libro>(
    initialData ? { ...EMPTY, ...initialData } : EMPTY
  );

  useEffect(() => {
    if (initialData) setForm({ ...EMPTY, ...initialData });
    else setForm(EMPTY);
  }, [initialData?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "anioPublicacion" && value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
            placeholder="Título del libro"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Autor</label>
          <input
            name="autor"
            value={form.autor}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
            placeholder="Autor"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">Género</label>
          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
          >
            {GENEROS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">ISBN</label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
            placeholder="ISBN"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">Editorial</label>
          <input
            name="editorial"
            value={form.editorial}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
            placeholder="Editorial"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Año publicación</label>
          <input
            name="anioPublicacion"
            type="number"
            value={form.anioPublicacion ?? ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-200 p-3"
            placeholder="1999"
            min={0}
            inputMode="numeric"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600">Sinopsis</label>
        <textarea
          name="sinopsis"
          value={form.sinopsis ?? ""}
          onChange={handleChange}
          rows={5}
          className="mt-2 w-full rounded-lg border border-slate-200 p-3"
          placeholder="Breve descripción"
        />
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name="disponible"
          checked={!!form.disponible}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span className="text-slate-700">Disponible</span>
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
      >
        {submitText}
      </button>
    </form>
  );
}
