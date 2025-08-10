import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

const Home = React.lazy(() => import('./components/Home'));
const FormBuilder = React.lazy(() => import('./components/FormBuilder/FormBuilder'));
const FormPreview = React.lazy(() => import('./components/FormPreview/FormPreview'));
const MyForms = React.lazy(() => import('./components/MyForms/MyForms'));

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Create', path: '/create' },
  { label: 'Preview', path: '/preview' },
  { label: 'My Forms', path: '/myforms' },
];

function App() {
  const location = useLocation();
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: '#3B1F8E',
          boxShadow: 4,
        }}
      >
        <Toolbar>
          <Box mr={2} fontSize={32}>
            🍳
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: 36,
                color: '#fff',
                fontFamily: 'Afacad',
                letterSpacing: 1,
                lineHeight: 1.1,
                background: 'linear-gradient(90deg, #fff 60%, #FF9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              upliance.ai
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: 24,
                color: '#fff',
                fontFamily: 'Afacad',
                letterSpacing: 1,
                lineHeight: 1.1,
                borderBottom: '3px solid #FF9900',
                pb: 0.5,
                mb: 0,
              }}
            >
              Form Builder
            </Typography>
          </Box>
          {navLinks.map(link => (
            <Button
              key={link.path}
              color="inherit"
              component={NavLink}
              to={link.path}
              sx={(navProps: any) => ({
                mx: 1,
                fontWeight: 700,
                borderBottom: navProps.isActive ? '2px solid #fff' : 'none',
                borderRadius: 0,
                transition: 'all 0.2s',
                background: navProps.isActive ? 'rgba(255,255,255,0.08)' : 'none',
                fontSize: 18,
              })}
              end={link.path === '/'}
            >
              {link.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<FormBuilder key={location.pathname} />} />
            <Route path="/preview" element={<FormPreview key={location.pathname} />} />
            <Route path="/myforms" element={<MyForms />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </React.Suspense>
      </Container>
      {/* <Box component="footer" sx={{ width: '100%', background: 'rgb(var(--color-button-background))', py: 3, mt: 4 }}>
        <Typography variant="body2" color="#fff" align="center">
          © {new Date().getFullYear()} upliance.ai — India's first AI cooking assistant
        </Typography>
      </Box> */}
    </>
  );
}

export default App; 