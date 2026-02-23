'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { useState } from 'react';

const FILTERS = ['Bug', 'Feature', 'Task', 'Improvement'];

export default function CheckboxShowcase() {
  const [checked, setChecked] = useState([true, false]);
  const [filters, setFilters] = useState<string[]>(['Bug']);

  const allChecked = checked.every(Boolean);
  const indeterminate = checked.some(Boolean) && !allChecked;

  const toggleFilter = (label: string) => {
    setFilters(prev => (prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic states */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">States</p>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
          <FormControlLabel control={<Checkbox />} label="Unchecked" />
          <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
          <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
          <FormControlLabel control={<Checkbox disabled checked />} label="Disabled checked" />
        </Box>
      </div>

      {/* Colors */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">Colors</p>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Checkbox defaultChecked color="primary" />
          <Checkbox defaultChecked color="secondary" />
          <Checkbox defaultChecked color="success" />
          <Checkbox defaultChecked color="error" />
          <Checkbox defaultChecked color="warning" />
        </Box>
      </div>

      {/* Indeterminate parent */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Parent / child (indeterminate)
        </p>
        <FormControlLabel
          label="Select all subtasks"
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={e => setChecked([e.target.checked, e.target.checked])}
            />
          }
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
          {['Write unit tests', 'Update documentation'].map((label, i) => (
            <FormControlLabel
              key={label}
              label={label}
              control={
                <Checkbox
                  checked={checked[i]}
                  onChange={e => {
                    const next = [...checked];
                    next[i] = e.target.checked;
                    setChecked(next);
                  }}
                />
              }
            />
          ))}
        </Box>
      </div>

      {/* Filter group */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Filter group — issue types
        </p>
        <FormControl component="fieldset">
          <FormLabel component="legend">Filter by type</FormLabel>
          <FormGroup row>
            {FILTERS.map(label => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={filters.includes(label)}
                    onChange={() => toggleFilter(label)}
                    size="small"
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
        {filters.length > 0 && (
          <p className="text-sm mt-2 text-zinc-500">Active: {filters.join(', ')}</p>
        )}
      </div>
    </div>
  );
}
