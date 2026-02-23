'use client';

import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import FilterListIcon from '@mui/icons-material/FilterList';
import FlagIcon from '@mui/icons-material/Flag';
import GroupIcon from '@mui/icons-material/Group';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LabelIcon from '@mui/icons-material/Label';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SortIcon from '@mui/icons-material/Sort';
import StarIcon from '@mui/icons-material/Star';
import TaskIcon from '@mui/icons-material/Task';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const ICONS = [
  { Icon: AddIcon, name: 'Add' },
  { Icon: AssignmentIcon, name: 'Assignment' },
  { Icon: AttachFileIcon, name: 'AttachFile' },
  { Icon: BugReportIcon, name: 'BugReport' },
  { Icon: CheckCircleIcon, name: 'CheckCircle' },
  { Icon: CloseIcon, name: 'Close' },
  { Icon: CommentIcon, name: 'Comment' },
  { Icon: ContentCopyIcon, name: 'ContentCopy' },
  { Icon: DashboardIcon, name: 'Dashboard' },
  { Icon: DeleteIcon, name: 'Delete' },
  { Icon: EditIcon, name: 'Edit' },
  { Icon: ErrorIcon, name: 'Error' },
  { Icon: FilterListIcon, name: 'FilterList' },
  { Icon: FlagIcon, name: 'Flag' },
  { Icon: GroupIcon, name: 'Group' },
  { Icon: KeyboardArrowDownIcon, name: 'KeyboardArrowDown' },
  { Icon: LabelIcon, name: 'Label' },
  { Icon: LightbulbIcon, name: 'Lightbulb' },
  { Icon: LinkIcon, name: 'Link' },
  { Icon: NotificationsIcon, name: 'Notifications' },
  { Icon: PersonIcon, name: 'Person' },
  { Icon: RefreshIcon, name: 'Refresh' },
  { Icon: SearchIcon, name: 'Search' },
  { Icon: SettingsIcon, name: 'Settings' },
  { Icon: SortIcon, name: 'Sort' },
  { Icon: StarIcon, name: 'Star' },
  { Icon: TaskIcon, name: 'Task' },
  { Icon: TrendingUpIcon, name: 'TrendingUp' },
  { Icon: WarningIcon, name: 'Warning' },
];

export default function IconShowcase() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Hover for icon name. From <code>@mui/icons-material</code> — 2,100+ icons available.
      </p>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {ICONS.map(({ Icon, name }) => (
          <Tooltip key={name} title={name} arrow>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'default',
                minWidth: 64,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Icon fontSize="small" />
              <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary' }}>
                {name}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </div>
  );
}
