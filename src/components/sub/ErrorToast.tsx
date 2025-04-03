
import { toast } from "sonner";

export const handleError = (error: any) => {
  toast.error(error?.message || "An error occurred", { 
    style: { background: "#1D1D1D", color: "#FFFFFF" }
  });
};

export const handleInfo = (info: any) => {
  toast.info(info?.message || "Information", { 
    style: { background: "#1D1D1D", color: "#FFFFFF" }
  });
};

export const handleSuccess = (message: string) => {
  toast.success(message, { 
    style: { background: "#1D1D1D", color: "#3CE7B2" }
  });
};
