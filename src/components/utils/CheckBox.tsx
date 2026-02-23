'use client';
import Check from '@mui/icons-material/Check';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const UncheckedIcon = styled('span')({
  width: 16,
  height: 16,
  borderRadius: 4,
  border: '1px solid var(--border)',
  backgroundColor: 'var(--input-background)',
  display: 'block',
});

const CheckedIcon = styled('span')({
  width: 16,
  height: 16,
  borderRadius: 4,
  backgroundColor: 'var(--primary)',
  border: '1px solid var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary-foreground)',
});

const StyledCheckbox = styled(MuiCheckbox)({
  padding: 0,
  '&.Mui-disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&.Mui-focusVisible span': {
    outline: '3px solid var(--ring)',
    outlineOffset: 2,
  },
});

function Checkbox({ ...props }: CheckboxProps) {
  return (
    <StyledCheckbox
      data-slot="checkbox"
      icon={<UncheckedIcon />}
      checkedIcon={
        <CheckedIcon>
          <Check sx={{ fontSize: 12 }} />
        </CheckedIcon>
      }
      {...props}
    />
  );
}

export { Checkbox };
