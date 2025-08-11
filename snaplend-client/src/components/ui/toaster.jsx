import React, { useEffect } from "react";
import { useToastStore } from "./use-toast-base";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => removeToast(t.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border shadow-lg p-4 bg-white ${
            toast.variant === "destructive"
              ? "border-red-500 text-red-700"
              : "border-gray-200 text-gray-900"
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description && <div className="text-sm">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
