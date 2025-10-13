import { useMutation } from '@tanstack/react-query';
import { executeCode, CompilerResponse } from '@/api/compilerApi';
import { toast } from 'sonner';

export const useCodeExecution = () => {
  const mutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      return await executeCode(code, language);
    },
    onSuccess: (data: CompilerResponse) => {
      if (!data.success) {
        toast.error('Execution Failed', {
          description: data.status_message || 'An error occurred during execution.',
        });
      }
    },
    onError: (error: any) => {
      toast.error('Failed to execute code', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const executeCodeMutation = (code: string, language: string) => {
    mutation.mutate({ code, language });
  };

  return {
    executeCode: executeCodeMutation,
    isLoading: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
