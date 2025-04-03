
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { File, CompilerResponse } from '@/api/types/compiler';
import { executeCode } from '@/api/compilerApi';

// Define state type
interface CompilerState {
  code: string;
  language: string;
  loading: boolean;
  file: string;
  result: CompilerResponse;
  files: File[];
  currentFile: string | null;
  isRenaming: boolean;
  newFileName: string;
  fileToRename: string | null;
}

// Initial state
const initialState: CompilerState = {
  code: '',
  language: 'javascript',
  loading: false,
  file: 'js',
  result: { output: '', status_message: '', success: false },
  files: [],
  currentFile: null,
  isRenaming: false,
  newFileName: '',
  fileToRename: null,
};

export const runCode = createAsyncThunk(
  'xCodeCompiler/runCode',
  async ({ code, reqLang }: { code: string; reqLang: string }, { rejectWithValue }) => {
    try {
      const result = await executeCode(code, reqLang);
      return result;
    } catch (error: any) {
      toast.error('Failed to execute code');
      return rejectWithValue({
        output: '',
        status_message: 'An error occurred during execution.',
        success: false,
      });
    }
  }
);

const compilerSlice = createSlice({
  name: 'xCodeCompiler',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
      if (state.currentFile) {
        state.files = state.files.map((file) =>
          file.id === state.currentFile
            ? { ...file, content: action.payload, lastModified: new Date().toISOString() }
            : file
        );
        localStorage.setItem('xcode-files', JSON.stringify(state.files));
      }
    },

    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      if (state.currentFile) {
        state.files = state.files.map((file) =>
          file.id === state.currentFile
            ? { ...file, language: action.payload, lastModified: new Date().toISOString() }
            : file
        );
        localStorage.setItem('xcode-files', JSON.stringify(state.files));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setResult: (state, action: PayloadAction<CompilerResponse>) => {
      state.result = action.payload;
    },    

    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
      localStorage.setItem('xcode-files', JSON.stringify(state.files));
    },

    setCurrentFile: (state, action: PayloadAction<string | null>) => {
      state.currentFile = action.payload;
      if (action.payload) {
        const file = state.files.find((f) => f.id === action.payload);
        if (file) {
          state.code = file.content;
          state.language = file.language;
        }
      }
    },

    setFile: (state, action: PayloadAction<string>) => {
      state.file = action.payload;
      if (state.currentFile) {
        state.files = state.files.map((file) =>
          file.id === state.currentFile
            ? { ...file, name: file.name.replace(/\.[^.]+$/, `.${action.payload}`), lastModified: new Date().toISOString() }
            : file
        );
        localStorage.setItem('xcode-files', JSON.stringify(state.files));
      }
    },

    setRenaming: (state, action: PayloadAction<boolean>) => {
      state.isRenaming = action.payload;
    },

    setNewFileName: (state, action: PayloadAction<string>) => {
      state.newFileName = action.payload;
    },

    setFileToRename: (state, action: PayloadAction<string | null>) => {
      state.fileToRename = action.payload;
    },

    saveCurrentFile: (
      state,
      action: PayloadAction<{ currentFile: string; code: string }>
    ) => {
      const { currentFile, code } = action.payload;
      if (!currentFile) return;
      state.files = state.files.map((file) =>
        file.id === currentFile
          ? { ...file, content: code, lastModified: new Date().toISOString() }
          : file
      );
      localStorage.setItem('xcode-files', JSON.stringify(state.files));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCode.pending, (state) => {
        state.loading = true;
        state.result = { output: '', status_message: '', success: false };
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.loading = false;
        state.result = action.payload as CompilerResponse;
      });
  },
});

export const {
  setCode,
  setLanguage,
  setLoading,
  setResult,
  setFiles,
  setFile,
  setCurrentFile,
  setRenaming,
  setNewFileName,
  setFileToRename,
  saveCurrentFile,
} = compilerSlice.actions;

export default compilerSlice.reducer;
