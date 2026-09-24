// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { compileExperience } from '../dist/index.js';

const fixture = () => JSON.parse(readFileSync(new URL('../examples/contract-approval.json', import.meta.url), 'utf8'));

test('compiles a decision, preserving source, evidence and unavailable actions', () => {
  const input = fixture();
  const before = structuredClone(input);
  const ir = compileExperience(input);
  assert.equal(ir.workspace, 'decision');
  assert.equal(ir.source.tenant, input.metadata.tenant);
  assert.equal(ir.source.revision, 1);
  assert.equal(ir.facts[0].id, 'discount');
  assert.equal(ir.evidence.items[0].ref, 'evidence:demo-margin');
  assert.equal(ir.actions[0].confirmation, 'required');
  assert.equal(ir.actions[2].enabled, false);
  assert.ok(ir.actions[2].reason);
  assert.deepEqual(compileExperience(input), ir);
  ir.facts[0].label = 'changed';
  assert.deepEqual(input, before);
});

test('never removes confirmation for high-risk actions', () => {
  const input = fixture();
  input.spec.actions[0].requiresConfirmation = false;
  assert.equal(compileExperience(input).actions[0].confirmation, 'required');
});

test('rejects malformed or ambiguous contracts', () => {
  for (const mutate of [
    value => { value.apiVersion = 'unknown'; },
    value => { delete value.metadata.tenant; },
    value => { value.metadata.revision = 0; },
    value => { value.spec.actions[0].availability = 'AUTHORIZED'; },
    value => { value.spec.actions[0].risk = 'UNKNOWN'; },
    value => { value.spec.actions[0].url = 'https://example.com/approve'; },
    value => { delete value.spec.actions[2].reason; },
    value => { value.spec.facts.push(value.spec.facts[0]); },
    value => { value.spec.actions.push(value.spec.actions[0]); },
  ]) {
    const input = fixture(); mutate(input);
    assert.throws(() => compileExperience(input));
  }
});

test('handles empty collections without inventing facts or actions', () => {
  const input = fixture();
  input.spec.work.type = 'INVESTIGATION';
  for (const key of ['facts', 'attention', 'evidence', 'actions']) input.spec[key] = [];
  const ir = compileExperience(input);
  assert.equal(ir.workspace, 'work');
  assert.deepEqual(ir.actions, []);
  assert.deepEqual(ir.facts, []);
});

test('example provider conforms to the shared Schema', () => {
  const schema = JSON.parse(readFileSync(new URL('../spec/provider.schema.json', import.meta.url), 'utf8'));
  const provider = JSON.parse(readFileSync(new URL('../examples/provider.json', import.meta.url), 'utf8'));
  const validate = new Ajv2020({ strict: true }).compile(schema);
  assert.equal(validate(provider), true, JSON.stringify(validate.errors));
});
