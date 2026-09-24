// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import type { WorkExperienceContract } from './generated/work-experience.js';

const schema = JSON.parse(readFileSync(new URL('../spec/work-experience.schema.json', import.meta.url), 'utf8'));
const validator = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true }).compile<WorkExperienceContract>(schema);

/** Structural validation cannot replace Core authorization. */
export function parseWorkContract(input: unknown): WorkExperienceContract {
  if (!validator(input)) {
    throw new Error(`Invalid work contract: ${JSON.stringify(validator.errors)}`);
  }
  for (const items of [input.spec.facts, input.spec.attention]) {
    const ids = items.map(item => item.id);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate work item IDs');
  }
  const capabilities = input.spec.actions.map(action => action.capability);
  if (new Set(capabilities).size !== capabilities.length) throw new Error('Duplicate action capabilities');
  for (const action of input.spec.actions) {
    if (action.availability === 'UNAVAILABLE' && !action.reason?.trim()) {
      throw new Error('Unavailable actions require a reason');
    }
  }
  return input;
}
