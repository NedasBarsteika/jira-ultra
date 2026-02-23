import MuiInputBase, { InputBaseProps } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

const StyledInput = styled(MuiInputBase)(() => ({
  width: '100%',
  height: 36,
  padding: '4px 12px',
  fontSize: '0.875rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--input-background)',
  color: 'var(--foreground)',
  transition: 'color 0.2s, box-shadow 0.2s',

  '& input': {
    padding: 0,
    height: '100%',
    fontSize: 'inherit',
    color: 'inherit',

    '&::placeholder': {
      color: 'var(--muted-foreground)',
      opacity: 1,
    },

    '&::selection': {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
    },
  },

  '&.Mui-focused': {
    borderColor: 'var(--ring)',
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent)',
  },

  '&.Mui-disabled': {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  "&[aria-invalid='true']": {
    borderColor: 'var(--destructive)',
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent)',
  },
}));

function Input({ className, ...props }: InputBaseProps) {
  return <StyledInput data-slot="input" className={className} {...props} />;
}

export { Input };
