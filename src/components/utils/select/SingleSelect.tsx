'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SingleSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  // String = error message shown as helper text; boolean = just highlight red
  error?: string | boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export default function SingleSelect({
  options,
  value,
  onChange,
  label,
  error,
  helperText,
  size = 'small',
  fullWidth = true,
  disabled = false,
  required = false,
}: SingleSelectProps) {
  const hasError = !!error;
  const errorMessage = typeof error === 'string' ? error : undefined;
  const displayHelper = errorMessage ?? helperText;

  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      required={required}
      error={hasError}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.icon ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {opt.icon}
                {opt.label}
              </Box>
            ) : (
              opt.label
            )}
          </MenuItem>
        ))}
      </Select>
      {displayHelper && <FormHelperText>{displayHelper}</FormHelperText>}
    </FormControl>
  );
}
