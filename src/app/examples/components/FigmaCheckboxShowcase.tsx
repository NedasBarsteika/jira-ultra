'use client';

import { useState } from 'react';

import { Checkbox } from '@/components/utils/CheckBox';
import { Label } from '@/components/utils/Label';

export default function FigmaCheckboxShowcase() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Label className="text-sm text-muted-foreground cursor-pointer">{'Remember me'}</Label>
      <Checkbox
        id="remember"
        checked={rememberMe}
        onChange={e => setRememberMe(e.target.checked)}
      />
    </div>
  );
}
