// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import { compileFromFile } from 'json-schema-to-typescript';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
await mkdir(new URL('../src/generated/', import.meta.url), { recursive: true });
const output = await compileFromFile(fileURLToPath(new URL('../spec/work-experience.schema.json', import.meta.url)), {
  bannerComment: '/* Copyright 2026 coRoof contributors\n * SPDX-License-Identifier: Apache-2.0\n * Generated from spec/work-experience.schema.json. Do not edit.\n */',
});
await writeFile(new URL('../src/generated/work-experience.ts', import.meta.url), output);
