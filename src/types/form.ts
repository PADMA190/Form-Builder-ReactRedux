export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  emailFormat?: boolean;
  passwordRule?: boolean; // e.g., min 8 chars, must contain a number
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: string[]; // For select, radio, checkbox
  derived?: false;
}

export interface DerivedField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: string[];
  derived: true;
  parentFieldIds: string[];
  formula: string; // e.g., JS expression as string
}

export type FormField = BaseField | DerivedField;

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
} 