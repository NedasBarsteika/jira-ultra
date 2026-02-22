'use client';

import AddIcon from '@mui/icons-material/Add';
import BugReportIcon from '@mui/icons-material/BugReport';
import EditIcon from '@mui/icons-material/Edit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TaskIcon from '@mui/icons-material/Task';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

export default function FABShowcase() {
  return (
    <div className="flex flex-col gap-6">
      {/* Sizes */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Circular — sizes
        </p>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Small" arrow>
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon fontSize="small" />
            </Fab>
          </Tooltip>
          <Tooltip title="Medium" arrow>
            <Fab size="medium" color="primary" aria-label="edit">
              <EditIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Large" arrow>
            <Fab size="large" color="primary" aria-label="add large">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </div>

      {/* Colors */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Colors</p>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Create issue" arrow>
            <Fab color="primary" size="medium" aria-label="create issue">
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Report bug" arrow>
            <Fab color="error" size="medium" aria-label="report bug">
              <BugReportIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Add feature" arrow>
            <Fab color="success" size="medium" aria-label="add feature">
              <LightbulbIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Add task" arrow>
            <Fab color="secondary" size="medium" aria-label="add task">
              <TaskIcon />
            </Fab>
          </Tooltip>
        </Box>
      </div>

      {/* Extended */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Extended — pill shape with label
        </p>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Fab variant="extended" color="primary" size="medium">
            <AddIcon sx={{ mr: 1 }} />
            Create Issue
          </Fab>
          <Fab variant="extended" color="error" size="medium">
            <BugReportIcon sx={{ mr: 1 }} />
            Report Bug
          </Fab>
          <Fab variant="extended" size="small">
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </Fab>
        </Box>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Disabled</p>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Fab disabled aria-label="disabled">
            <AddIcon />
          </Fab>
          <Fab variant="extended" disabled>
            <AddIcon sx={{ mr: 1 }} />
            Disabled
          </Fab>
        </Box>
      </div>
    </div>
  );
}
