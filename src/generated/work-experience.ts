/* Copyright 2026 coRoof contributors
 * SPDX-License-Identifier: Apache-2.0
 * Generated from spec/work-experience.schema.json. Do not edit.
 */

export interface WorkExperienceContract {
  apiVersion: "coroof.io/v0.1";
  kind: "WorkExperienceContract";
  metadata: {
    id: string;
    tenant: string;
    revision: number;
  };
  spec: {
    actor: {
      ref: string;
    };
    work: {
      id: string;
      title: string;
      type: "ACTION" | "DECISION" | "INVESTIGATION" | "REVIEW" | "APPROVAL" | "COMMUNICATION" | "WAIT";
    };
    focus: {
      ref: string;
    };
    facts: {
      id: string;
      label: string;
      value: string | number | boolean | null;
      importance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    }[];
    attention: {
      id: string;
      severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      reason: string;
    }[];
    evidence: {
      ref: string;
      label: string;
    }[];
    actions: {
      capability: string;
      label: string;
      availability: "AVAILABLE" | "UNAVAILABLE";
      risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      requiresConfirmation: boolean;
      reason?: string;
    }[];
  };
}
