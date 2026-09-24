// Copyright 2026 coRoof contributors
// SPDX-License-Identifier: Apache-2.0
import { parseWorkContract } from './validate.js';
import type { WorkExperienceContract } from './generated/work-experience.js';
export { parseWorkContract } from './validate.js';
export type { WorkExperienceContract } from './generated/work-experience.js';

type Spec = WorkExperienceContract['spec'];
export interface ExperienceIR {
  apiVersion: 'coroof.io/experience/v0.1';
  kind: 'ExperienceIR';
  source: { contractId: string; revision: number; tenant: string; actorRef: string };
  workspace: 'decision' | 'work';
  title: string;
  focus: Spec['focus'];
  facts: Spec['facts'];
  warnings: Spec['attention'];
  evidence: { disclosure: 'progressive'; items: Spec['evidence'] };
  actions: Array<{
    capability: string;
    label: string;
    enabled: boolean;
    confirmation: 'required' | 'none';
    reason: string | null;
  }>;
}

const priority = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 } as const;

/** Deterministic compilation only: no credentials, network calls or execution. */
export function compileExperience(input: unknown): ExperienceIR {
  const contract = parseWorkContract(input);
  const { spec, metadata } = contract;
  return {
    apiVersion: 'coroof.io/experience/v0.1',
    kind: 'ExperienceIR',
    source: { contractId: metadata.id, revision: metadata.revision, tenant: metadata.tenant, actorRef: spec.actor.ref },
    workspace: ['DECISION', 'APPROVAL', 'REVIEW'].includes(spec.work.type) ? 'decision' : 'work',
    title: spec.work.title,
    focus: { ...spec.focus },
    facts: spec.facts.map(fact => ({ ...fact })).sort((a, b) => priority[b.importance] - priority[a.importance]),
    warnings: spec.attention.map(item => ({ ...item })).sort((a, b) => priority[b.severity] - priority[a.severity]),
    evidence: { disclosure: 'progressive', items: spec.evidence.map(item => ({ ...item })) },
    actions: spec.actions.map(action => ({
      capability: action.capability,
      label: action.label,
      enabled: action.availability === 'AVAILABLE',
      confirmation: action.requiresConfirmation || ['HIGH', 'CRITICAL'].includes(action.risk) ? 'required' : 'none',
      reason: action.reason ?? null,
    })),
  };
}
