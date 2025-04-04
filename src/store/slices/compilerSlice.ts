
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { compileCode } from '@/api/compilerApi';

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

export interface CompilerState {
  files: File[];
  currentFileId: string | null;
  output: string;
  loading: boolean;
  error: string | null;
  code: string;
  language: string;
  file: string;
  currentFile: string | null;
  result: CompilerResponse | null;
}

const initialState: CompilerState = {
  files: [],
  currentFileId: null,
  output: '',
  loading: false,
  error: null,
  code: '',
  language: 'javascript',
  file: 'js',
  currentFile: null,
  result: null
};

// Create async thunk for running code
export const runCode = createAsyncThunk(
  'compiler/runCode',
  async ({ code, reqLang }: { code: string; reqLang: string }, { rejectWithValue }) => {
    try {
      const response = await compileCode({ code, language: reqLang });
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to compile code');
    }
  }
);

const compilerSlice = createSlice({
  name: 'compiler',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
      state.currentFileId = action.payload.id;
      state.currentFile = action.payload.id;
    },
    updateFile: (state, action: PayloadAction<Partial<File> & { id: string }>) => {
      state.files = state.files.map(file =>
        file.id === action.payload.id ? { ...file, ...action.payload } : file
      );
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      if (state.currentFileId === action.payload) {
        state.currentFileId = state.files.length > 0 ? state.files[0].id : null;
        state.currentFile = state.files.length > 0 ? state.files[0].id : null;
      }
    },
    setCurrentFile: (state, action: PayloadAction<string>) => {
      state.currentFileId = action.payload;
      state.currentFile = action.payload;
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setFile: (state, action: PayloadAction<string>) => {
      state.file = action.payload;
    },
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    setResult: (state, action: PayloadAction<CompilerResponse>) => {
      state.result = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addFile,
  updateFile,
  deleteFile,
  setCurrentFile,
  setOutput,
  setLoading,
  setError,
  setCode,
  setLanguage,
  setFile,
  setFiles,
  setResult
} = compilerSlice.actions;

export default compilerSlice.reducer;
