import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => {
      // Prevent duplicate toasts anywhere in the store (title, description, variant)
      const exists = state.toasts.some(
        (t) =>
          t.title === toast.title &&
          t.description === toast.description &&
          t.variant === (toast.variant || "default")
      );
      if (exists) {
        return state; // No change if duplicate exists
      }
      return {
        toasts: [...state.toasts, { ...toast, id: Date.now() }],
      };
    }),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);

  const toast = ({ title, description, variant = "default" }) => {
    addToast({ title, description, variant });
  };

  return { toast };
}
