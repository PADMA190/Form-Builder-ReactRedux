import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadFormsFromLocalStorage } from '../../redux/formsSlice';
import { Typography, Card, CardActionArea, Box, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const forms = useSelector((state: RootState) => state.forms.forms);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadFormsFromLocalStorage() as any);
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary" textAlign="center">
        My Forms
      </Typography>
      {forms.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <Alert severity="info" sx={{ fontSize: 20, fontWeight: 600 }}>
            No forms available
          </Alert>
        </Box>
      ) : (
        <Stack spacing={3} alignItems="center">
          {forms.map(form => (
            <Card
              key={form.id}
              elevation={4}
              sx={{
                borderLeft: '6px solid #2575fc',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.03)',
                  boxShadow: 8,
                  cursor: 'pointer',
                },
                width: { xs: '100%', sm: '80%', md: '60%' },
                maxWidth: 500,
              }}
            >
              <CardActionArea
                onClick={() => {
                  dispatch({ type: 'formBuilder/setFormBuilderState', payload: { fields: form.fields, name: form.name } });
                  navigate('/preview');
                }}
                sx={{ p: 2 }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <DescriptionIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h6" fontWeight={600} color="text.secondary">
                    {form.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(form.createdAt).toLocaleString()}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyForms; 