import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export function Dialog({ open, onClose, children }) {
  console.log('Dialog render - open:', open, 'onClose function:', onClose);

  useEffect(() => {
    console.log('Dialog useEffect - open changed to:', open);
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      console.log('Dialog useEffect cleanup - removing keydown listener');
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]); // Removed onClose from dependencies

  if (!open) {
    console.log('Dialog not rendering - open is false');
    return null;
  }

  console.log('Dialog rendering with open=true');

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full mx-4 p-6 animate-fade-in relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-slate-900">{children}</h2>;
}

export function DialogContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}
