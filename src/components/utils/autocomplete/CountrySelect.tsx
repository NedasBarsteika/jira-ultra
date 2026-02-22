'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { COUNTRIES, type Country } from '@/config/constants';
import { getFlagEmoji } from '@/utils/get-flag-emoji';

interface CountrySelectProps {
  value?: Country | null;
  onChange?: (country: Country | null) => void;
  label?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function CountrySelect({
  value = null,
  onChange,
  label = 'Country',
  size = 'medium',
  fullWidth = true,
  disabled = false,
}: CountrySelectProps) {
  return (
    <Autocomplete
      options={COUNTRIES}
      value={value}
      onChange={(_, newValue) => onChange?.(newValue)}
      autoHighlight
      fullWidth={fullWidth}
      disabled={disabled}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, val) => option.code === val.code}
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <Box key={key} component="li" sx={{ '& > span': { mr: 1.5, fontSize: 20 } }} {...rest}>
            <span>{getFlagEmoji(option.code)}</span>
            {option.label}
            <Box component="span" sx={{ ml: 'auto', color: 'text.secondary', fontSize: 12 }}>
              +{option.phone}
            </Box>
          </Box>
        );
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          size={size}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password',
            },
          }}
        />
      )}
    />
  );
}
