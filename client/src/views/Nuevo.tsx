import { useNavigate } from "react-router-dom";
import LibroForm from "../views/LibroForm";
import { useLibros } from "../hooks/useLibros";
import type { Libro } from "../types/types";

export default function Nuevo() {
  const navigate = useNavigate();
  const { createLibro, loading, error } = useLibros();

  const handleSubmit = async (book: Partial<Libro>) => {
    const { success } = await createLibro(book as Libro);
    if (success) navigate("/");
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Nuevo libro</h2>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LibroForm submitText="Crear libro" onSubmit={handleSubmit} loading={loading} />
      </div>
    </section>
  );
}
