import { spawnSync } from 'child_process';

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', env: process.env, shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npx', ['kysely-codegen', '--dialect=postgres', '--out-file=src/types/db.ts']);
run('node', ['scripts/generate-db-meta.mjs']);
