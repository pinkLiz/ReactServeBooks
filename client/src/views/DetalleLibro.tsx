import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLibros } from "../hooks/useLibros";
import type { Libro } from "../types/types";
import { useToast } from "../components/Toast";
import ConfirmDialog from "../components/Dialog";

export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLibroId, updateDisponibilidad, deleteLibro, error } = useLibros();
  const { showToast } = useToast();

  const [book, setBook] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const [confirm, setConfirm] = useState<{ open: boolean; loading?: boolean }>({
    open: false,
    loading: false,
  });

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getLibroId(Number(id));
    setBook(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="text-slate-500">Cargando…</div>;
  if (!book) return <div className="text-slate-600">Libro no encontrado.</div>;

  const handleToggle = async () => {
    if (!book?.id) return;
    try {
      setToggling(true);
      await updateDisponibilidad(book.id);
      const updated = await getLibroId(book.id);
      setBook(updated);
      showToast({
        message: updated?.disponible
          ? "El libro ahora esta disponible."
          : "El libro se marco como no disponible.",
        variant: "success",
      });
    } catch {
      showToast({ message: "No se pudo actualizar la disponibilidad.", variant: "error" });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!book?.id) return;
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await deleteLibro(book.id);
      showToast({ message: "Libro eliminado correctamente.", variant: "success" });
      navigate("/");
    } catch {
      showToast({ message: "No se pudo eliminar el libro.", variant: "error" });
      setConfirm({ open: false, loading: false });
    }
  };

  return (
    <section className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{book.titulo}</h2>
          <p className="mt-1 text-slate-600">de {book.autor}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/libros/${book.id}/editar`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
          >
            Editar
          </Link>

          <button
            onClick={handleToggle}
            disabled={toggling}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {toggling
              ? "Guardando…"
              : book.disponible
              ? "Marcar no disponible"
              : "Marcar disponible"}
          </button>

          <button
            onClick={() => setConfirm({ open: true, loading: false })}
            className="rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-500"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Género</dt>
            <dd className="mt-1 text-slate-800">{book.genero}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">ISBN</dt>
            <dd className="mt-1 text-slate-800">{book.isbn}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Editorial</dt>
            <dd className="mt-1 text-slate-800">{book.editorial}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Año publicación</dt>
            <dd className="mt-1 text-slate-800">{book.anioPublicacion ?? "—"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Sinopsis</dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-800">
              {book.sinopsis || "Sin sinopsis"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Disponibilidad</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  book.disponible ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {book.disponible ? "Disponible" : "No disponible"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Eliminar libro"
        message={`¿Seguro que deseas eliminar “${book.titulo}”? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onClose={() => setConfirm({ open: false })}
        loading={confirm.loading}
      />
    </section>
  );
}
