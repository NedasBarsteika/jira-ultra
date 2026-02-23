'use client';

import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

export default function AvatarBadgeChipShowcase() {
  const [chips, setChips] = useState(['Frontend', 'React', 'TypeScript', 'Bug', 'High Priority']);

  return (
    <div className="flex flex-col gap-8">
      {/* Avatars */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Avatar — variants
        </p>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Alice Johnson">
            <Avatar sx={{ bgcolor: 'primary.main' }}>AJ</Avatar>
          </Tooltip>
          <Tooltip title="Bob Smith">
            <Avatar sx={{ bgcolor: 'secondary.main' }}>BS</Avatar>
          </Tooltip>
          <Avatar variant="rounded" sx={{ bgcolor: 'success.main' }}>
            <AssignmentIcon />
          </Avatar>
          <Avatar variant="square" sx={{ bgcolor: 'error.main' }}>
            <BugReportIcon />
          </Avatar>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'warning.main', fontSize: 18 }}>CW</Avatar>
        </Box>
      </div>

      {/* Avatar Group */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Avatar group — team members
        </p>
        <AvatarGroup max={4}>
          {['AJ', 'BS', 'CW', 'DL', 'EM'].map((initials, i) => (
            <Tooltip key={initials} title={`Member ${i + 1}`}>
              <Avatar
                sx={{
                  bgcolor: [
                    'primary.main',
                    'secondary.main',
                    'success.main',
                    'warning.main',
                    'error.main',
                  ][i],
                  width: 36,
                  height: 36,
                  fontSize: 13,
                }}
              >
                {initials}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </div>

      {/* Badges */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Badge — counts &amp; indicators
        </p>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge badgeContent={4} color="primary">
            <NotificationsIcon />
          </Badge>
          <Badge badgeContent={12} color="error">
            <NotificationsIcon />
          </Badge>
          <Badge badgeContent={99} max={99} color="warning">
            <NotificationsIcon />
          </Badge>
          <Badge variant="dot" color="success">
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 12 }}>
              AJ
            </Avatar>
          </Badge>
          <Badge badgeContent={0} showZero color="secondary">
            <NotificationsIcon />
          </Badge>
        </Box>
      </div>

      {/* Chips */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Chip — labels &amp; tags (click × to delete)
        </p>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {chips.map(chip => (
            <Chip
              key={chip}
              label={chip}
              size="small"
              onDelete={() => setChips(prev => prev.filter(c => c !== chip))}
            />
          ))}
          {chips.length === 0 && <span className="text-sm text-zinc-400">All labels removed</span>}
        </Box>
      </div>

      {/* Chip variants */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Chip — variants &amp; colors
        </p>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Default" size="small" />
          <Chip label="Primary" color="primary" size="small" />
          <Chip label="Success" color="success" size="small" />
          <Chip label="Error" color="error" size="small" />
          <Chip label="Warning" color="warning" size="small" />
          <Chip label="Outlined" variant="outlined" color="primary" size="small" />
          <Chip icon={<BugReportIcon />} label="Bug" color="error" size="small" />
          <Chip
            avatar={<Avatar sx={{ bgcolor: 'primary.main', fontSize: 10 }}>AJ</Avatar>}
            label="Alice"
            size="small"
          />
        </Box>
      </div>
    </div>
  );
}
