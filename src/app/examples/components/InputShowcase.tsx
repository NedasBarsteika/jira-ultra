'use client';

import InputAdornment from '@mui/material/InputAdornment';
import { Mail } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/utils/inputs/input';
import { Label } from '@/components/utils/Label';

export default function InputShowcase() {
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-2">
      <Label>Email address</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'var(--muted-foreground)' }}>
            <Mail size={16} />
          </InputAdornment>
        }
      />
    </div>
  );
}
