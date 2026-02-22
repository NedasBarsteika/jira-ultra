'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useToast } from '@/components/utils/toast/ToastProvider';

export default function FeedbackShowcase() {
  const toast = useToast();
  const [uploadProgress] = useState(68);

  return (
    <div className="flex flex-col gap-8">
      {/* Tooltip */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Tooltip — placements &amp; arrow
        </p>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip title="Top tooltip" placement="top" arrow>
            <Button variant="outlined" size="small">
              Top
            </Button>
          </Tooltip>
          <Tooltip title="Bottom tooltip" placement="bottom" arrow>
            <Button variant="outlined" size="small">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip title="Left tooltip" placement="left" arrow>
            <Button variant="outlined" size="small">
              Left
            </Button>
          </Tooltip>
          <Tooltip title="Right tooltip" placement="right" arrow>
            <Button variant="outlined" size="small">
              Right
            </Button>
          </Tooltip>
          <Tooltip title="Story points represent effort, not time" arrow>
            <IconButton size="small">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit issue" arrow>
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete issue" arrow>
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy link" arrow>
            <IconButton size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </div>

      {/* Linear Progress */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">Linear progress</p>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Determinate — file upload ({uploadProgress}%)
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 0.5 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Indeterminate — loading
            </Typography>
            <LinearProgress sx={{ mt: 0.5 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Buffer
            </Typography>
            <LinearProgress variant="buffer" value={45} valueBuffer={60} sx={{ mt: 0.5 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['primary', 'secondary', 'success', 'error', 'warning'] as const).map(color => (
              <LinearProgress
                key={color}
                variant="determinate"
                value={70}
                color={color}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
            ))}
          </Box>
        </Box>
      </div>

      {/* Circular Progress */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Circular progress
        </p>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <CircularProgress />
          <CircularProgress color="secondary" />
          <CircularProgress color="success" />
          <CircularProgress color="error" />
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={75} size={56} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                75%
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>

      {/* Toast */}
      <div>
        <p className="text-sm font-medium mb-3 text-zinc-500 dark:text-zinc-400">
          Toast — via <code>useToast()</code>
        </p>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => toast.success('Issue KS-42 updated successfully')}
          >
            Success
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => toast.error('Failed to save changes. Please try again.')}
          >
            Error
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => toast.warning('You are about to delete 5 issues.')}
          >
            Warning
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<InfoIcon />}
            onClick={() => toast.info('Sprint 3 starts on Monday.')}
          >
            Info
          </Button>
        </Box>
      </div>
    </div>
  );
}
