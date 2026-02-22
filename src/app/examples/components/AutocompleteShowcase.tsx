'use client';

import { useState } from 'react';

import CountrySelect from '@/components/utils/autocomplete/CountrySelect';
import MultiSelect from '@/components/utils/select/MultiSelect';
import SingleSelect from '@/components/utils/select/SingleSelect';
import { type Country } from '@/config/constants';

const TEAM_MEMBERS = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'carol', label: 'Carol White' },
  { value: 'david', label: 'David Lee' },
  { value: 'eva', label: 'Eva Martinez' },
];

const LABELS = ['Bug', 'Feature', 'Improvement', 'Documentation', 'Design', 'Backend', 'Frontend'];

export default function AutocompleteShowcase() {
  const [country, setCountry] = useState<Country | null>(null);
  const [assignee, setAssignee] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [sprint, setSprint] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {/* Country Select */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Country select — flag emoji, name &amp; dial code
        </p>
        <CountrySelect value={country} onChange={setCountry} />
        {country && (
          <p className="text-sm mt-2 text-zinc-500">
            Selected: {country.label} (+{country.phone})
          </p>
        )}
      </div>

      {/* Single select — assignee */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Single select — assignee
        </p>
        <SingleSelect
          label="Assignee"
          value={assignee}
          onChange={setAssignee}
          options={TEAM_MEMBERS}
        />
      </div>

      {/* Multi-select with chips */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Multi-select — issue labels
        </p>
        <MultiSelect
          label="Labels"
          options={LABELS}
          value={selectedLabels}
          onChange={setSelectedLabels}
        />
      </div>

      {/* Free solo */}
      <div>
        <p className="text-sm font-medium mb-2 text-zinc-500 dark:text-zinc-400">
          Free solo — type or select a sprint
        </p>
        <MultiSelect
          label="Sprint"
          options={['Sprint 1', 'Sprint 2', 'Sprint 3', 'Backlog']}
          value={sprint}
          onChange={setSprint}
          freeSolo
        />
      </div>
    </div>
  );
}
