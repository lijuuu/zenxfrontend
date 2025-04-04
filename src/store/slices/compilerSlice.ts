import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { File, CompilerResponse } from '@/api/types/problem-execution';

interface CompilerState {
  files: File[];
  currentFileId: string | null;
  output: string;
  loading: boolean;
  error: string | null;
}

const initialState: CompilerState = {
  files: [],
  currentFileId: null,
  output: '',
  loading: false,
  error: null,
};

const compilerSlice = createSlice({
  name: 'compiler',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
      state.currentFileId = action.payload.id;
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
      }
    },
    setCurrentFile: (state, action: PayloadAction<string>) => {
      state.currentFileId = action.payload;
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
} = compilerSlice.actions;

export default compilerSlice.reducer;
