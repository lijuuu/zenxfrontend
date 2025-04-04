
import axios from 'axios';

// Define CompilerResponse type directly to avoid dependency on missing file
export interface CompilerResponse {
  output: string;
  status_message: string;
  success: boolean;
  execution_time?: number;
  error?: string;
}

export const executeCode = async (code: string, language: string): Promise<CompilerResponse> => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  const apiUrl =
    environment === 'DEVELOPMENT'
      ? import.meta.env.VITE_XENGINELOCALENGINEURL
      : import.meta.env.VITE_XENGINEPRODUCTIONENGINEURL;

  if (!language) {
    console.log('No language selected');
    return { output: '', status_message: 'No language selected', success: false };
  }

  try {
    const response = await axios.post(
      apiUrl || 'http://localhost:7000/api/v1/compile', // Default to localhost if env variable not set
      { code: btoa(code), language },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const responseData = response.data as CompilerResponse;

    if (!responseData.success) {
      return {
        output: responseData.output,
        status_message: responseData.error || 'An error occurred.',
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
    console.error('Error during request:', error);
    return {
      output: error.response?.data?.output || '',
      status_message: error.response?.data?.error || 'An error occurred during execution.',
      success: false,
    };
  }
};

// Add missing function to support the compiler slice
export const compileCode = async (code: string, language: string, input?: string): Promise<CompilerResponse> => {
  if (!language) {
    console.log('No language selected');
    return { output: '', status_message: 'No language selected', success: false };
  }

  // For mock purposes, we'll simulate a response
  return new Promise((resolve) => {
    // Simulate some delay
    setTimeout(() => {
      // Randomly succeed or fail
      const success = Math.random() > 0.2;
      
      if (success) {
        resolve({
          output: input 
            ? `Input: ${input}\nOutput: Result for the given input`
            : "Code compiled and ran successfully!",
          status_message: 'Compilation successful',
          success: true,
          execution_time: Math.floor(Math.random() * 100),
        });
      } else {
        resolve({
          output: '',
          status_message: `Compilation error in ${language}:\nSyntax error at line ${Math.floor(Math.random() * 10) + 1}`,
          success: false,
        });
      }
    }, 1000);
  });
};
