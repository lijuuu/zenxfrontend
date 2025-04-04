
export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface CompilerResponse {
  output?: string;
  status_message?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
}
