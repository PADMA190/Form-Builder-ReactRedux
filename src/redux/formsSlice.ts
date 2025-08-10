import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema } from '../types/form';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FormsState {
  forms: FormSchema[];
}

const initialState: FormsState = {
  forms: [],
};

const LOCAL_STORAGE_KEY = 'upliance_forms';

export const loadFormsFromLocalStorage = createAsyncThunk(
  'forms/loadFromLocalStorage',
  async () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as FormSchema[];
    }
    return [];
  }
);

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setForms(state, action: PayloadAction<FormSchema[]>) {
      state.forms = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.forms));
    },
    addForm(state, action: PayloadAction<FormSchema>) {
      state.forms.push(action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.forms));
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.forms = state.forms.filter(f => f.id !== action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.forms));
    },
  },
  extraReducers: builder => {
    builder.addCase(loadFormsFromLocalStorage.fulfilled, (state, action) => {
      state.forms = action.payload;
    });
  },
});

export const { setForms, addForm, deleteForm } = formsSlice.actions;
export default formsSlice.reducer; 