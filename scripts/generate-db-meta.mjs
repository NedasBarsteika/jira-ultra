/**
 * Reads the kysely-codegen output (src/types/db.ts) and generates
 * src/types/db-meta.ts with typed runtime constants for every table
 * name and column name.
 *
 * Run via: npm run db:codegen
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, '../src/types/db.ts'), 'utf-8');

// ── 1. Parse the DB interface → { tableName: InterfaceName } ────────────────
const dbBlock = src.match(/export interface DB \{([^}]+)\}/s)?.[1] ?? '';
const tableMap = {}; // e.g. { task: 'Task', sprint_schedule: 'SprintSchedule' }
for (const [, table, iface] of dbBlock.matchAll(/^\s+(\w+):\s+(\w+);/gm)) {
  tableMap[table] = iface;
}

// ── 2. Parse each table interface → column names ─────────────────────────────
const columnMap = {}; // e.g. { task: { iface: 'Task', cols: ['id', 'title', ...] } }
for (const [table, iface] of Object.entries(tableMap)) {
  const block = src.match(new RegExp(`export interface ${iface} \\{([^}]+)\\}`, 's'))?.[1] ?? '';
  const cols = [...block.matchAll(/^\s+(\w+):/gm)].map(m => m[1]);
  columnMap[table] = { iface, cols };
}

// ── 3. Emit ──────────────────────────────────────────────────────────────────
const lines = [
  '/**',
  ' * Auto-generated - DO NOT edit manually.',
  ' * Regenerate with: npm run db:codegen',
  ' */',
  '',
  '// All table names exactly as they appear in the database.',
  'export const Tables = {',
  ...Object.keys(tableMap).map(t => `  ${t}: '${t}',`),
  '} as const;',
  '',
  'export type TableName = keyof typeof Tables;',
  '',
];

for (const [, { iface, cols }] of Object.entries(columnMap)) {
  lines.push(`// Runtime column names for the ${iface} interface.`);
  lines.push(`export const ${iface} = {`);
  for (const col of cols) lines.push(`  ${col}: '${col}',`);
  lines.push('} as const;');
  lines.push('');
}

writeFileSync(resolve(__dirname, '../src/types/db-meta.ts'), lines.join('\n'));
console.log(`✓ Generated src/types/db-meta.ts (${Object.keys(tableMap).length} tables)`);
