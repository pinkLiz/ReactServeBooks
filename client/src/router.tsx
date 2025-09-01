import { createBrowserRouter } from "react-router-dom";
import "./index.css";

import Layout from "./layout/Layout";
import Libros from "./views/Libros";
import Nuevo from "./views/Nuevo";
import DetalleLibro from "./views/DetalleLibro";
import EditarLibro from "./views/EditarLibro";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Libros /> },
      { path: "libros/nuevo", element: <Nuevo /> },
      { path: "libros/:id", element: <DetalleLibro /> },
      { path: "libros/:id/editar", element: <EditarLibro /> },
    ],
  },
]);


