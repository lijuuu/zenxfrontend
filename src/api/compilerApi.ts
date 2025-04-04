import axiosInstance from "@/utils/axiosInstance";

export interface CompilerResponse {
  output: string;
  status_message: string;
  success: boolean;
  execution_time?: number;
  error?: string;
}

export const executeCode = async (code: string, language: string): Promise<CompilerResponse> => {
  if (!language) {
    console.error("No language selected");
    return {
      output: "",
      status_message: "No language selected",
      success: false,
    };
  }

  try {
    const response = await axiosInstance.post(
      "/compile", 
      { code: btoa(code), language },
      { headers: { "Content-Type": "application/json" } } 
    );

    const responseData = response.data as CompilerResponse;

    if (!responseData.success) {
      return {
        output: responseData.output || "",
        status_message: responseData.error || "An error occurred.",
        success: false,
        execution_time: responseData.execution_time,
      };
    }

    return {
      output: responseData.output,
      status_message: responseData.status_message,
      success: true,
      execution_time: responseData.execution_time,
    };
  } catch (error: any) {
    console.error("Error during request:", error);

    if (error.response) {
      return {
        output: error.response.data?.output || "",
        status_message: error.response.data?.error || "An error occurred during execution.",
        success: false,
      };
    }

    return {
      output: "",
      status_message: "An unexpected error occurred.",
      success: false,
    };
  }
};