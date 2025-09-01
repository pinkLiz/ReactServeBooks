import { Link } from "react-router-dom";
import { useLibros } from "../hooks/useLibros"

export default function Libros() {
  const { libros, loading, error } = useLibros();

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Todos los libros</h2>
        <Link
          to="/libros/nuevo"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-500"
        >
          Agregar libro
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-slate-500">Cargando…</div>
      ) : libros.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
          No hay libros aún.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Título</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Autor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Género</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Disponibilidad</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {libros.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 text-slate-800">{b.titulo}</td>
                  <td className="px-4 py-3 text-slate-700">{b.autor}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {b.genero}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.disponible ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {b.disponible ? "Si" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/libros/${b.id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
