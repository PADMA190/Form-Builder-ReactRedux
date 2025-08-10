import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Box, Typography, TextField, MenuItem, Checkbox, FormControlLabel, RadioGroup, Radio, Button, Alert, Paper, Card, CardContent, InputAdornment } from '@mui/material';
import { FormField } from '../../types/form';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';

function validateField(field: FormField, value: any, allValues: Record<string, any>, formFields: FormField[]) {
  const errors: string[] = [];
  if (field.validation?.required && (!value || value === '')) {
    errors.push('Required');
  }
  if (field.type === 'text' || field.type === 'textarea') {
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      errors.push(`Min length: ${field.validation.minLength}`);
    }
    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      errors.push(`Max length: ${field.validation.maxLength}`);
    }
    if (field.validation?.emailFormat) {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(value)) {
        errors.push('Invalid email');
      }
    }
    if (field.validation?.passwordRule) {
      if (value.length < 8 || !/\d/.test(value)) {
        errors.push('Password must be at least 8 characters and contain a number');
      }
    }
  }
  // Confirm password logic
  if (field.label.toLowerCase().includes('confirm') && field.label.toLowerCase().includes('password')) {
    const passwordField = Object.entries(allValues).find(([fid, val]) => {
      const f = formFields.find((ff: FormField) => ff.id === fid);
      return f && f.label.toLowerCase() === 'password';
    });
    if (passwordField && value !== passwordField[1]) {
      errors.push('Passwords do not match');
    }
  }
  return errors;
}

function computeDerived(formFields: FormField[], field: FormField, values: Record<string, any>) {
  if (!('parentFieldIds' in field) || !field.formula) return '';
  try {
    // Map parent field labels to their values
    const parentFields = formFields.filter(f => field.parentFieldIds.includes(f.id));
    const argNames = parentFields.map(f => f.label.replace(/\s+/g, ''));
    const argValues = parentFields.map(f => values[f.id]);
    // eslint-disable-next-line no-new-func
    const func = new Function(...argNames, `return ${field.formula}`);
    return func(...argValues);
  } catch {
    return '';
  }
}

const FormPreview: React.FC = () => {
  const fields = useSelector((state: RootState) => state.formBuilder.fields);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Reset state on mount/unmount
  useEffect(() => {
    console.log('FormPreview mounted');
    setSubmitted(false);
    setErrors({});
    return () => {
      console.log('FormPreview unmounted');
      setSubmitted(false);
      setErrors({});
    };
  }, []);

  // Initialize values for all fields on mount and when fields change
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach(field => {
      if (field.derived && 'parentFieldIds' in field && field.formula) {
        initialValues[field.id] = computeDerived(fields, field, initialValues);
      } else {
        initialValues[field.id] = field.defaultValue || (field.type === 'checkbox' ? [] : '');
      }
    });
    setValues(initialValues);
  }, [fields]);

  // Derived fields auto-update (recalculate when parent values change)
  useEffect(() => {
    let changed = false;
    const newValues = { ...values };
    fields.forEach(field => {
      if (field.derived && 'parentFieldIds' in field && field.formula) {
        const computed = computeDerived(fields, field, newValues);
        if (newValues[field.id] !== computed) {
          newValues[field.id] = computed;
          changed = true;
        }
      }
    });
    if (changed) {
      setValues(newValues);
    }
  }, [fields, values]);

  const handleChange = (id: string, value: any) => {
    setValues(v => ({ ...v, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};
    fields.forEach(field => {
      newErrors[field.id] = validateField(field, values[field.id], values, fields);
    });
    setErrors(newErrors);
    setSubmitted(true);
  };

  // If no fields, show a message and optionally redirect
  if (fields.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <Alert severity="info" sx={{ fontSize: 20, fontWeight: 600 }}>
          No preview available
        </Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={6} sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary" textAlign="center">
        Form Preview
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {fields.map(field => (
          <Card key={field.id} elevation={2} sx={{ mb: 3, borderLeft: `6px solid ${field.derived ? '#2575fc' : '#6a11cb'}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                {(() => {
                  switch (field.type) {
                    case 'text': return <TextFieldsIcon color="primary" sx={{ mr: 1 }} />;
                    case 'number': return <NumbersIcon color="primary" sx={{ mr: 1 }} />;
                    case 'textarea': return <NotesIcon color="primary" sx={{ mr: 1 }} />;
                    case 'date': return <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />;
                    case 'checkbox': return <CheckBoxIcon color="primary" sx={{ mr: 1 }} />;
                    case 'radio': return <RadioButtonCheckedIcon color="primary" sx={{ mr: 1 }} />;
                    case 'select': return <ListAltIcon color="primary" sx={{ mr: 1 }} />;
                    default: return null;
                  }
                })()}
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                  {field.label || 'Untitled Field'}
                </Typography>
              </Box>
              {(() => {
                if (field.derived) {
                  return (
                    <TextField
                      label={field.label}
                      value={values[field.id] || ''}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      margin="normal"
                    />
                  );
                }
                switch (field.type) {
                  case 'text':
                    return (
                      <TextField
                        label={field.label}
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors[field.id]?.length}
                        helperText={errors[field.id]?.[0]}
                      />
                    );
                  case 'number':
                    return (
                      <TextField
                        label={field.label}
                        type="number"
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors[field.id]?.length}
                        helperText={errors[field.id]?.[0]}
                      />
                    );
                  case 'textarea':
                    return (
                      <TextField
                        label={field.label}
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={3}
                        error={!!errors[field.id]?.length}
                        helperText={errors[field.id]?.[0]}
                      />
                    );
                  case 'select':
                    return (
                      <TextField
                        label={field.label}
                        select
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors[field.id]?.length}
                        helperText={errors[field.id]?.[0]}
                      >
                        {field.options?.map((opt: string) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    );
                  case 'radio':
                    return (
                      <RadioGroup
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                      >
                        {field.options?.map((opt: string) => (
                          <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                        ))}
                      </RadioGroup>
                    );
                  case 'checkbox':
                    return (
                      <>
                        {field.options?.map((opt: string) => (
                          <FormControlLabel
                            key={opt}
                            control={
                              <Checkbox
                                checked={Array.isArray(values[field.id]) && values[field.id].includes(opt)}
                                onChange={e => {
                                  const arr = Array.isArray(values[field.id]) ? [...values[field.id]] : [];
                                  if (e.target.checked) arr.push(opt);
                                  else arr.splice(arr.indexOf(opt), 1);
                                  handleChange(field.id, arr);
                                }}
                              />
                            }
                            label={opt}
                          />
                        ))}
                      </>
                    );
                  case 'date':
                    return (
                      <TextField
                        label={field.label}
                        type="date"
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors[field.id]?.length}
                        helperText={errors[field.id]?.[0]}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </CardContent>
          </Card>
        ))}
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, fontWeight: 600, borderRadius: 2, boxShadow: 2 }}>
          Validate
        </Button>
        {submitted && Object.values(errors).some(arr => arr.length > 0) && (
          <Alert severity="error" sx={{ mt: 2, fontWeight: 600, fontSize: 18 }}>
            Please fix the errors above.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default FormPreview; 