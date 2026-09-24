// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import { compileExperience } from '../dist/index.js';

const coreDir = process.argv[2] || process.env.COROOF_CORE_DIR;
if (!coreDir) throw new Error('Pass the coRoof checkout path: npm run test:integration -- "../coRoof core"');
const core = resolve(coreDir);
for (const relative of ['spec/work-experience.schema.json', 'spec/provider.schema.json', 'examples/contract-approval.json', 'examples/provider.json']) {
  const local = JSON.parse(readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));
  const remote = JSON.parse(readFileSync(join(core, relative), 'utf8'));
  assert.deepEqual(remote, local, 'Shared protocol drift: ' + relative);
}
const fixturePath = fileURLToPath(new URL('../examples/contract-approval.json', import.meta.url));
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
const serialized = execFileSync('go', ['run', './cmd/coroof', 'roundtrip-work', fixturePath], {
  cwd: core, encoding: 'utf8', env: { ...process.env, GOWORK: 'off' },
});
const actual = JSON.parse(serialized);
assert.deepEqual(actual, fixture, 'Go must preserve every shared contract field');
assert.deepEqual(compileExperience(actual), compileExperience(fixture));
console.log('Go → JSON Schema → TypeScript → Experience IR: passed');
