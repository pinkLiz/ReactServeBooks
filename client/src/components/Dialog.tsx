type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

export default function Dialog({
  open,
  title = "¿Estas seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Si, eliminar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-[999] w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
