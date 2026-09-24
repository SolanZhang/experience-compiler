// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import { readFile } from 'node:fs/promises';
import { compileExperience } from './index.js';

try {
  const filename = process.argv[2];
  if (!filename || process.argv.length !== 3) throw new Error('Usage: node dist/cli.js WORK_CONTRACT.json');
  const input: unknown = JSON.parse(await readFile(filename, 'utf8'));
  process.stdout.write(`${JSON.stringify(compileExperience(input), null, 2)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Compilation failed');
  process.exitCode = 1;
}
