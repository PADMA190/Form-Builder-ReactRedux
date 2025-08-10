import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  addField,
  updateField,
  deleteField,
  reorderFields,
  setFormName,
  resetFormBuilder,
} from '../../redux/formBuilderSlice';
import { addForm } from '../../redux/formsSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  List,
  Card,
  CardContent,
  Fade,
  Chip,
  Paper,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Divider,
  Drawer,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FieldType, FormField, FormSchema } from '../../types/form';
import { useNavigate } from 'react-router-dom';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
];

const defaultField = (type: FieldType): FormField => {
  const base = {
    id: uuidv4(),
    type,
    label: '',
    defaultValue: '',
    validation: {},
    options: ['Option 1', 'Option 2'],
    derived: false as const,
  };
  if (type === 'select' || type === 'radio' || type === 'checkbox') {
    return { ...base, options: ['Option 1', 'Option 2'] };
  }
  return base;
};

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fields = useSelector((state: RootState) => state.formBuilder.fields);
  const formName = useSelector((state: RootState) => state.formBuilder.name);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempName, setTempName] = useState(formName);

  React.useEffect(() => {
    console.log('FormBuilder mounted');
    return () => console.log('FormBuilder unmounted');
  }, []);

  // Add new field
  const handleAddField = (type: FieldType) => {
    dispatch(addField(defaultField(type)));
  };

  // Save form
  const handleSaveForm = () => {
    setShowNameDialog(true);
  };

  const handleNameDialogClose = (save: boolean) => {
    if (save && tempName.trim()) {
      dispatch(setFormName(tempName.trim()));
      const form: FormSchema = {
        id: uuidv4(),
        name: tempName.trim(),
        createdAt: new Date().toISOString(),
        fields,
      };
      dispatch(addForm(form));
      // Set formBuilder state to the saved form and navigate to preview
      dispatch({ type: 'formBuilder/setFormBuilderState', payload: { fields, name: tempName.trim() } });
      navigate('/preview');
    }
    setShowNameDialog(false);
  };

  // Field config UI
  const handleFieldChange = (id: string, changes: Partial<FormField>) => {
    const field = fields.find(f => f.id === id);
    if (!field) return;
    // Handle derived toggle
    if (changes.hasOwnProperty('derived')) {
      if (changes.derived) {
        // If toggling on, and this is a number field, and there is a date field, auto-select it as parent and prefill formula for Age from DOB
        let parentFieldIds: string[] = [];
        let formula = '';
        const dobField = fields.find(f => f.type === 'date');
        if (field.type === 'number' && dobField) {
          if (dobField.label && dobField.label.trim()) {
            parentFieldIds = [dobField.id];
            const dobVar = dobField.label.replace(/\s+/g, '');
            formula = `Math.floor((${dobVar} ? (Date.now() - new Date(${dobVar}).getTime()) / 3.15576e+10 : 0))`;
          } else {
            parentFieldIds = [dobField.id]; // allow selection, but no formula
          }
        }
        dispatch(updateField({
          id,
          field: {
            ...field,
            derived: true,
            parentFieldIds,
            formula,
          },
        }));
        return;
      } else {
        // Convert to base field
        const { parentFieldIds, formula, ...rest } = field as any;
        dispatch(updateField({
          id,
          field: {
            ...rest,
            derived: false,
          },
        }));
        return;
      }
    }
    // If updating parentFieldIds, ensure only non-derived fields are selectable
    if ('parentFieldIds' in changes && Array.isArray((changes as any).parentFieldIds)) {
      const validParents = fields.filter(f => f.id !== id && !f.derived).map(f => f.id);
      (changes as any).parentFieldIds = (changes as any).parentFieldIds.filter((pid: string) => validParents.includes(pid));
    }
    dispatch(updateField({ id, field: changes }));
  };

  // Reorder
  const moveField = (from: number, to: number) => {
    if (to < 0 || to >= fields.length) return;
    dispatch(reorderFields({ from, to }));
  };

  // Delete
  const handleDelete = (id: string) => {
    dispatch(deleteField(id));
  };

  return (
    <Box display="flex" minHeight="70vh">
      {/* Sidebar Drawer for field types */}
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{ sx: { width: 200, background: '#3B1F8E', color: '#fff', pt: 8, mt: '64px', height: 'calc(100vh - 64px)' } }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1, color: '#fff', fontSize: 22 }}>
            Add Field
          </Typography>
        </Box>
        <Stack spacing={2} alignItems="center">
          {FIELD_TYPES.map(ft => (
            <Button
              key={ft.value}
              variant="contained"
              color="secondary"
              sx={{ width: 160, fontWeight: 600, borderRadius: 2, boxShadow: 2, textTransform: 'none', fontSize: 16 }}
              onClick={() => handleAddField(ft.value)}
            >
              {ft.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
      {/* Main content area */}
      <Box flex={1} ml={15}>
        <Typography variant="h3" gutterBottom fontWeight={800} color="primary" sx={{ fontSize: 32 }}>
          Form Builder
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2, background: '#f8fafd' }}>
          <List>
            {fields.map((field, idx) => (
              <Fade in key={field.id} timeout={400}>
                <Card elevation={4} sx={{ mb: 3, borderLeft: `6px solid ${field.derived ? '#2575fc' : '#6a11cb'}` }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Chip
                        label={field.type.toUpperCase() + (field.derived ? ' (Derived)' : '')}
                        color={field.derived ? 'secondary' : 'primary'}
                        sx={{ mr: 2, fontWeight: 600, letterSpacing: 1 }}
                      />
                      <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ fontSize: 20 }}>
                        {field.label || 'Untitled Field'}
                      </Typography>
                    </Box>
                    {/* Field config UI below */}
                    <Box>
                      <TextField
                        label={<span style={{ fontSize: 18, fontWeight: 500 }}>{'Label'}</span>}
                        value={field.label}
                        onChange={e => handleFieldChange(field.id, { label: e.target.value })}
                        sx={{ mr: 2, mb: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!field.validation?.required}
                            onChange={e => handleFieldChange(field.id, { validation: { ...field.validation, required: e.target.checked } })}
                            color="secondary"
                          />
                        }
                        label="Required"
                      />
                      {field.type === 'text' || field.type === 'textarea' ? (
                        <>
                          <TextField
                            label="Min Length"
                            type="number"
                            value={field.validation?.minLength || ''}
                            onChange={e => handleFieldChange(field.id, { validation: { ...field.validation, minLength: Number(e.target.value) } })}
                            sx={{ mr: 2, mb: 1 }}
                          />
                          <TextField
                            label="Max Length"
                            type="number"
                            value={field.validation?.maxLength || ''}
                            onChange={e => handleFieldChange(field.id, { validation: { ...field.validation, maxLength: Number(e.target.value) } })}
                            sx={{ mr: 2, mb: 1 }}
                          />
                        </>
                      ) : null}
                      {field.type === 'text' ? (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!field.validation?.emailFormat}
                                onChange={e => handleFieldChange(field.id, { validation: { ...field.validation, emailFormat: e.target.checked } })}
                                color="secondary"
                              />
                            }
                            label="Email Format"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!field.validation?.passwordRule}
                                onChange={e => handleFieldChange(field.id, { validation: { ...field.validation, passwordRule: e.target.checked } })}
                                color="secondary"
                              />
                            }
                            label="Password Rule"
                          />
                        </>
                      ) : null}
                      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                        <TextField
                          label="Options (comma separated)"
                          value={field.options?.join(',') || ''}
                          onChange={e => handleFieldChange(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                          sx={{ mr: 2, mb: 1 }}
                        />
                      )}
                      <TextField
                        label="Default Value"
                        value={field.defaultValue || ''}
                        onChange={e => handleFieldChange(field.id, { defaultValue: e.target.value })}
                        sx={{ mr: 2, mb: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!field.derived}
                            onChange={e => handleFieldChange(field.id, { derived: e.target.checked })}
                            color="secondary"
                          />
                        }
                        label="Derived Field"
                      />
                      {field.derived ? (
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <FormControl sx={{ minWidth: 200, mr: 2, mb: 1 }}>
                            <InputLabel id={`parent-select-label-${field.id}`}>Parent Fields</InputLabel>
                            <Select
                              labelId={`parent-select-label-${field.id}`}
                              multiple
                              value={(field as any).parentFieldIds || []}
                              onChange={e => handleFieldChange(field.id, { parentFieldIds: e.target.value })}
                              input={<OutlinedInput label="Parent Fields" />}
                              renderValue={(selected: any) =>
                                fields
                                  .filter(f => (field as any).parentFieldIds?.includes(f.id))
                                  .map(f => f.label || f.type)
                                  .join(', ')
                              }
                            >
                              {fields.filter(f => f.id !== field.id && !f.derived).map(f => (
                                <MenuItem key={f.id} value={f.id}>
                                  <Checkbox checked={(field as any).parentFieldIds?.includes(f.id)} />
                                  {/* MUIListItemText is not imported, so using Typography for now */}
                                  <Typography variant="body2">{f.label || f.type}</Typography>
                                </MenuItem>
                              ))}
                            </Select>
                            {fields.filter(f => f.id !== field.id && !f.derived).length === 0 && (
                              <Typography variant="caption" color="error">Please add and label a parent field first.</Typography>
                            )}
                          </FormControl>
                          <TextField
                            label="Formula (JS expression, use parent field labels as variables)"
                            value={(field as any).formula || ''}
                            onChange={e => handleFieldChange(field.id, { formula: e.target.value })}
                            sx={{ mr: 2, mb: 1 }}
                            fullWidth
                          />
                        </Box>
                      ) : null}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <IconButton edge="end" onClick={() => moveField(idx, idx - 1)} disabled={idx === 0}>
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => moveField(idx, idx + 1)} disabled={idx === fields.length - 1}>
                        <ArrowDownwardIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(field.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </List>
        </Paper>
        <Button variant="contained" color="primary" onClick={handleSaveForm} disabled={fields.length === 0} sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 2 }}>
          Save Form
        </Button>
        <Dialog open={showNameDialog} onClose={() => handleNameDialogClose(false)}>
          <DialogTitle>Enter Form Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Form Name"
              fullWidth
              value={tempName}
              onChange={e => setTempName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleNameDialogClose(false)}>Cancel</Button>
            <Button onClick={() => handleNameDialogClose(true)} disabled={!tempName.trim()}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FormBuilder; 