import React, { useEffect } from "react";
import { useToastStore } from "./use-toast";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => removeToast(t.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg p-4 shadow-md text-white ${
            t.variant === "destructive" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          <div className="font-bold">{t.title}</div>
          <div>{t.description}</div>
        </div>
      ))}
    </div>
  );
}
