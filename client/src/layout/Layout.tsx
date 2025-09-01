import { Outlet, NavLink, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Biblioteca</h1>
          <nav className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`
              }
            >
              Libros
            </NavLink>
            <Link
              to="/libros/nuevo"
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Nuevo libro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
