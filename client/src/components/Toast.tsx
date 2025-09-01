import React, { createContext, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";
type Toast = {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number; 
};

type ToastContextType = {
  showToast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function Toast({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID?.() ?? String(Math.random());
    const toast: Toast = { id, duration: 3000, variant: "success", ...t };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, toast.duration);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "min-w-[260px] max-w-[360px] rounded-lg px-4 py-3 shadow-lg text-sm text-white flex items-start gap-3",
              t.variant === "success" && "bg-green-600",
              t.variant === "error" && "bg-red-600",
              t.variant === "info" && "bg-slate-700",
              t.variant === "warning" && "bg-amber-500",
            ].join(" ")}
          >
            <span className="mt-0.5">
              {t.variant === "success" ? "✅" :
               t.variant === "error"   ? "⛔" :
               t.variant === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1">{t.message}</div>
            <button
              className="opacity-80 hover:opacity-100"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              aria-label="Cerrar"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toast>");
  return ctx;
}
