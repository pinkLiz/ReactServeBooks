// src/pages/EditBook.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLibros } from "../hooks/useLibros";
import LibroForm from "../views/LibroForm";
import type { Libro } from "../types/types";
import { useToast } from "../components/Toast";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLibroId, updateLibro } = useLibros();
  const { showToast } = useToast();

  const [book, setBook] = useState<Libro | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const data = await getLibroId(Number(id));
      if (data) setBook(data);
    })();
  }, [id, getLibroId]);

  if (!book) return <p className="text-slate-500">Cargando…</p>;

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">Editar libro</h2>

      <LibroForm
        initialData={book}
        submitText="Guardar cambios"
        onSubmit={async (payload) => {
          try {
            await updateLibro(book.id!, payload);
            showToast({
              message: "Cambios guardados con exito.",
              variant: "success",
            });
            navigate("/");
          } catch {
            showToast({
              message: "No se pudieron guardar los cambios.",
              variant: "error",
            });
          }
        }}
      />
    </div>
  );
}
