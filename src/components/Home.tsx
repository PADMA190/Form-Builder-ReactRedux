import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'transparent',
        borderRadius: 4,
        boxShadow: 0,
        p: 6,
      }}
    >
      <Paper elevation={3} sx={{ p: 6, background: 'rgba(255,255,255,0.97)', borderRadius: 4, maxWidth: 700 }}>
        <Typography variant="h2" gutterBottom color="primary" fontWeight={800} textAlign="center" sx={{ fontSize: 40 }}>
          upliance.ai Form Builder
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={2} textAlign="center" sx={{ fontSize: 24, fontWeight: 500 }}>
          Build, preview, and manage custom forms for the upliance.ai platform.
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4} textAlign="center" sx={{ fontSize: 18 }}>
          This internal tool empowers upliance.ai to create dynamic forms for onboarding, feedback, recipes, and more—fully customizable for the needs of India's first AI cooking assistant. Designed for the upliance team to streamline data collection, automate workflows, and deliver a seamless experience for users and staff. Built with modern tech, beautiful UI, and ready for real-world use at upliance.ai.
        </Typography>
        <Box textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: 20, borderRadius: 3, boxShadow: 3 }}
            onClick={() => navigate('/create')}
          >
            Get Started
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home; 