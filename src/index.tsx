import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5B2B90', // deep purple
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF9900', // orange
      contrastText: '#fff',
    },
    background: {
      default: '#FAF6E7', // light cream
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#5B2B90',
    },
  },
  typography: {
    fontFamily: 'Afacad, Montserrat, Roboto, Arial, sans-serif',
    h3: { fontWeight: 700, color: '#5B2B90' },
    h5: { fontWeight: 600, color: '#5B2B90' },
    h6: { fontWeight: 600, color: '#5B2B90' },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#5B2B90',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ body: { fontFamily: 'Afacad, Montserrat, Roboto, Arial, sans-serif' } }} />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
); 