import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField } from '../types/form';

interface FormBuilderState {
  fields: any[];
  name: string;
}

const initialState: FormBuilderState = {
  fields: [],
  name: '',
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setFields(state, action: PayloadAction<FormField[]>) {
      state.fields = action.payload;
    },
    addField(state, action: PayloadAction<FormField>) {
      state.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<{ id: string; field: Partial<FormField> }>) {
      const idx = state.fields.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) {
        state.fields[idx] = { ...state.fields[idx], ...action.payload.field };
      }
    },
    deleteField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter(f => f.id !== action.payload);
    },
    reorderFields(state, action: PayloadAction<{ from: number; to: number }>) {
      const [removed] = state.fields.splice(action.payload.from, 1);
      state.fields.splice(action.payload.to, 0, removed);
    },
    resetFormBuilder(state) {
      state.fields = [];
      state.name = '';
    },
    setFormBuilderState(state, action: PayloadAction<FormBuilderState>) {
      state.fields = action.payload.fields;
      state.name = action.payload.name;
    },
  },
});

export const {
  setFormName,
  setFields,
  addField,
  updateField,
  deleteField,
  reorderFields,
  resetFormBuilder,
  setFormBuilderState,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer; 