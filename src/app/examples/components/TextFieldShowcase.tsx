'use client';

import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';

import AppTextField from '@/components/utils/inputs/AppTextField';

export default function TextFieldShowcase() {
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className="flex flex-col gap-6">
      {/* Variants */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Variants</p>
        <div className="flex flex-col gap-3">
          <AppTextField label="Outlined (default)" variant="outlined" size="small" fullWidth />
          <AppTextField label="Filled" variant="filled" size="small" fullWidth />
          <AppTextField label="Standard" variant="standard" size="small" fullWidth />
        </div>
      </div>

      {/* Issue title with maxLength */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          With maxLength helper
        </p>
        <AppTextField
          label="Issue Title"
          placeholder="Short, descriptive title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          required
          maxLength={100}
          helperText={`${title.length} / 100`}
        />
      </div>

      {/* Multiline description */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Multiline - description
        </p>
        <AppTextField
          label="Description"
          multiline
          minRows={3}
          maxRows={6}
          fullWidth
          maxLength={500}
          helperText="Max 500 characters"
        />
      </div>

      {/* Error states */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Error states</p>
        <div className="flex flex-col gap-3">
          <AppTextField
            label="Email"
            defaultValue="not-an-email"
            error="Enter a valid email address"
            size="small"
            fullWidth
          />
          <AppTextField
            label="Password"
            type="password"
            defaultValue="abc"
            error="Password must be at least 8 characters"
            size="small"
            fullWidth
          />
          <AppTextField label="Required field" error={true} required size="small" fullWidth />
        </div>
      </div>

      {/* With adornments */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Input adornments
        </p>
        <div className="flex flex-col gap-3">
          <AppTextField
            label="Search issues"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <AppTextField
            label="Repository URL"
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">.git</InputAdornment>,
              },
            }}
          />
        </div>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Disabled</p>
        <AppTextField
          label="Read-only field"
          defaultValue="KS-42"
          disabled
          size="small"
          fullWidth
        />
      </div>
    </div>
  );
}
