'use client';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState } from 'react';

export interface AppTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  // Return a primitive used for sorting; falls back to row[key]
  getValue?: (row: T) => string | number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

interface AppTableProps<T extends object> {
  columns: AppTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
}

function toPrimitive(val: unknown): string | number {
  if (typeof val === 'string' || typeof val === 'number') return val;
  return '';
}

export default function AppTable<T extends object>({
  columns,
  rows,
  getRowKey,
  defaultSortKey,
  defaultSortDir = 'asc',
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  onRowClick,
  stickyHeader = false,
}: AppTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find(c => c.key === sortKey);
    const aVal = col?.getValue ? col.getValue(a) : (a as Record<string, unknown>)[sortKey];
    const bVal = col?.getValue ? col.getValue(b) : (b as Record<string, unknown>)[sortKey];
    let cmp = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(toPrimitive(aVal)).localeCompare(String(toPrimitive(bVal)));
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small" stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key} align={col.align ?? 'left'} width={col.width}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortKey === col.key}
                      direction={sortKey === col.key ? sortDir : 'asc'}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                    </TableSortLabel>
                  ) : (
                    col.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(row => (
              <TableRow
                key={getRowKey(row)}
                hover
                onClick={() => onRowClick?.(row)}
                sx={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map(col => (
                  <TableCell key={col.key} align={col.align ?? 'left'}>
                    {col.render
                      ? col.render(row)
                      : String(toPrimitive((row as Record<string, unknown>)[col.key]))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value));
          setPage(0);
        }}
      />
    </Paper>
  );
}
