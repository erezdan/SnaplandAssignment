import { useToast as useBaseToast } from "./use-toast-base";

export const useToast = () => {
  const { toast } = useBaseToast();
  return { toast };
};
