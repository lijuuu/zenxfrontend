
import axios from 'axios';
import { CompilerResponse } from './types/compiler';

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
