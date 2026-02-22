'use client';

import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';

interface AppTextFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  // String = error message shown as helper text; boolean = just highlight red
  error?: string | boolean;
  helperText?: string;
  maxLength?: number;
}

export default function AppTextField({
  error,
  helperText,
  maxLength,
  inputProps,
  ...props
}: AppTextFieldProps) {
  const hasError = !!error;
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <MuiTextField
      {...props}
      error={hasError}
      helperText={errorMessage ?? helperText}
      inputProps={{
        ...inputProps,
        ...(maxLength ? { maxLength } : {}),
      }}
    />
  );
}
