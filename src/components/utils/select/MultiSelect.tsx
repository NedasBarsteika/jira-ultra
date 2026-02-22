'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

export interface MultiSelectOption {
  value: string;
  label: string;
}

type OptionInput = string | MultiSelectOption;

interface MultiSelectProps {
  options: OptionInput[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  // String = error message shown as helper text; boolean = just highlight red
  error?: string | boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  freeSolo?: boolean;
}

function normalize(options: OptionInput[]): MultiSelectOption[] {
  return options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
}

export default function MultiSelect({
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
  placeholder,
  freeSolo = false,
}: MultiSelectProps) {
  const normalized = normalize(options);
  const selected = normalized.filter(o => value.includes(o.value));
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <Autocomplete
      multiple
      options={normalized}
      value={selected}
      onChange={(_, newValue) => {
        // freeSolo can yield strings; coerce them to MultiSelectOption
        const coerced = newValue.map(v => (typeof v === 'string' ? { value: v, label: v } : v));
        onChange(coerced.map(o => o.value));
      }}
      getOptionLabel={o => (typeof o === 'string' ? o : o.label)}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      freeSolo={freeSolo}
      disabled={disabled}
      fullWidth={fullWidth}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...rest } = getTagProps({ index });
          return <Chip key={key} label={option.label} size="small" {...rest} />;
        })
      }
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          size={size}
          required={required}
          placeholder={placeholder}
          error={!!error}
          helperText={errorMessage ?? helperText}
        />
      )}
    />
  );
}
