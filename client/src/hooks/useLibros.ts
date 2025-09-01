// src/hooks/useLibros.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { Libro } from "../types/types";

const API_URL =  "http://localhost:4000/api";

type ListParams = {
  titulo?: string;
  page?: number;
  limit?: number;
};

export function useLibros(initialParams?: ListParams) {
  const [libros, seLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getLibros = async (params?: ListParams) => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      const p = { ...(initialParams || {}), ...(params || {}) };
      if (p.titulo) q.set("titulo", p.titulo);
      if (p.page) q.set("page", String(p.page));
      if (p.limit) q.set("limit", String(p.limit));

      const res = await axios.get(`${API_URL}/libros${q.toString() ? `?${q}` : ""}`);
      seLibros((res.data?.data ?? []) as Libro[]);
      setError(null);
    } catch (err) {
      console.error("Error en getBooks:", err);
      setError("Error al obtener libros");
    } finally {
      setLoading(false);
    }
  };

  const createLibro = async (
    book: Partial<Libro>
  ): Promise<{ success: boolean; data?: Libro; message?: string }> => {
    try {
      const { id, ...payload } = book; 
      const res = await axios.post(`${API_URL}/libros`, payload);
      const nuevo = res.data?.data as Libro;
      seLibros((prev) => [...prev, nuevo]);
      setError(null);
      return { success: true, data: nuevo };
    } catch (err) {
      let backendMessage = "Error al crear libro";
      if (axios.isAxiosError(err)) {
        backendMessage =
          (err.response?.data as any)?.error ||
          (err.response?.data as any)?.errors?.map?.((e: any) => e.msg).join(", ") ||
          backendMessage;
      }
      setError(backendMessage);
      return { success: false, message: backendMessage };
    }
  };

  const getLibroId = async (id: number): Promise<Libro | null> => {
    try {
      const res = await axios.get(`${API_URL}/libros/${id}`);
      return res.data?.data as Libro;
    } catch (err) {
      console.error("Error en getBookById:", err);
      setError("Error al obtener libro por ID");
      return null;
    }
  };

  const updateLibro = async (id: number, book: Partial<Libro>) => {
    try {
      const { id: _omit, ...payload } = book;
      const res = await axios.put(`${API_URL}/libros/${id}`, payload);
      const actualizado = res.data?.data as Libro;
      seLibros((prev) => prev.map((b) => (b.id === id ? actualizado : b)));
      setError(null);
    } catch (err) {
      console.error("Error en updateBook:", err);
      setError("Error al actualizar libro");
    }
  };

  const updateDisponibilidad = async (id: number) => {
    try {
      const res = await axios.patch(`${API_URL}/libros/${id}/disponibilidad`);
      const actualizado = res.data?.data as Libro;
      seLibros((prev) => prev.map((b) => (b.id === id ? actualizado : b)));
      setError(null);
    } catch (err) {
      console.error("Error en updateDisponibilidad:", err);
      setError("Error al actualizar disponibilidad");
    }
  };

  const deleteLibro = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/libros/${id}`);
      seLibros((prev) => prev.filter((b) => b.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error en deleteBook:", err);
      setError("Error al eliminar libro");
    }
  };

  useEffect(() => {
    getLibros(initialParams);
  }, []);

  return {
    libros,
    loading,
    error,
    getLibros,
    createLibro,
    getLibroId,
    updateLibro,
    updateDisponibilidad,
    deleteLibro,
    seLibros, 
    setError
  };
}
