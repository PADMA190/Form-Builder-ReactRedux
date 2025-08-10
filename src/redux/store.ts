import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './formBuilderSlice';
import formsReducer from './formsSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use in components
export { useSelector, useDispatch } from 'react-redux'; 