'use client';

import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TaskIcon from '@mui/icons-material/Task';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState } from 'react';

import AppTextField from '@/components/utils/inputs/AppTextField';
import SingleSelect from '@/components/utils/select/SingleSelect';

export default function SelectShowcase() {
  const [status, setStatus] = useState('todo');
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('medium');
  const [storyPoints, setStoryPoints] = useState('');

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Select */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Select — issue status
        </p>
        <SingleSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'todo', label: 'To Do' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'in_review', label: 'In Review' },
            { value: 'done', label: 'Done' },
          ]}
        />
      </div>

      {/* Select with icons */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Select with icons — issue type
        </p>
        <SingleSelect
          label="Issue Type"
          value={issueType}
          onChange={setIssueType}
          options={[
            { value: 'bug', label: 'Bug', icon: <BugReportIcon fontSize="small" color="error" /> },
            {
              value: 'feature',
              label: 'Feature',
              icon: <LightbulbIcon fontSize="small" color="warning" />,
            },
            { value: 'task', label: 'Task', icon: <TaskIcon fontSize="small" color="primary" /> },
          ]}
        />
      </div>

      {/* Select with error */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Select — error state
        </p>
        <SingleSelect
          label="Assignee"
          value=""
          onChange={() => {}}
          options={[{ value: 'aj', label: 'Alice Johnson' }]}
          error="An assignee is required before moving to In Review"
          required
        />
      </div>

      {/* Radio Group */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Radio group — priority
        </p>
        <FormControl>
          <FormLabel>Priority</FormLabel>
          <RadioGroup row value={priority} onChange={e => setPriority(e.target.value)}>
            <FormControlLabel value="low" control={<Radio size="small" />} label="Low" />
            <FormControlLabel
              value="medium"
              control={<Radio size="small" color="primary" />}
              label="Medium"
            />
            <FormControlLabel
              value="high"
              control={<Radio size="small" color="warning" />}
              label="High"
            />
            <FormControlLabel
              value="critical"
              control={<Radio size="small" color="error" />}
              label="Critical"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Number input (story points) */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Number field — story points
        </p>
        <AppTextField
          label="Story Points"
          value={storyPoints}
          onChange={e => {
            const val = e.target.value;
            if (val === '' || (/^\d+$/.test(val) && Number(val) <= 100)) setStoryPoints(val);
          }}
          size="small"
          inputMode="numeric"
          helperText="Fibonacci: 1, 2, 3, 5, 8, 13, 21..."
          sx={{ width: 200 }}
        />
      </div>
    </div>
  );
}
