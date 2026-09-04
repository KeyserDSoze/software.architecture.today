import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateCaseExplanationResult } from "../dist/ai/case-explanation.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const AI_CONTRACT = path.join(ROOT, "docs", "ai-feature-contract.md");
const AI_SOURCE = path.join(ROOT, "src", "ai", "case-explanation.ts");
const EVALS = path.join(ROOT, "evals", "case-explanation-v1.jsonl");

async function text(file) {
  return readFile(file, "utf8");
}

function context() {
  return {
    caseId: "case-1",
    tenantId: "tenant-a",
    observedAt: "2026-09-04T10:00:00Z",
    sources: [
      {
        reference: "payments-1",
        kind: "Payments",
        observedAt: "2026-09-04T09:59:00Z",
        facts: { lastAttempt: "Failed" },
      },
    ],
  };
}

test("AI-001 AI Feature Contract, model boundary and eval seed exist", async () => {
  await Promise.all([access(AI_CONTRACT), access(AI_SOURCE), access(EVALS)]);
});

test("AI-002 semantic AI boundary remains provider-neutral and read-only in v1", async () => {
  const [contract, source] = await Promise.all([text(AI_CONTRACT), text(AI_SOURCE)]);

  assert.match(contract, /No write tools/i);
  assert.match(contract, /deterministic context assembly/i);
  assert.match(contract, /The model is not an authorization engine/i);
  assert.match(contract, /RAG\/vector retrieval\s+Not selected/i);

  assert.doesNotMatch(source, /@azure\//i);
  assert.doesNotMatch(source, /openai/i);
  assert.doesNotMatch(source, /anthropic/i);
});

test("AI-003 confirmed facts require known source references", () => {
  const failures = validateCaseExplanationResult(context(), {
    status: "Supported",
    summary: "The latest observed payment attempt failed.",
    confirmedFacts: [
      {
        text: "The latest observed payment attempt failed.",
        sourceReferences: ["payments-1"],
      },
    ],
    hypotheses: [],
    missingEvidence: [],
    sourceReferences: ["payments-1"],
  });

  assert.deepEqual(failures, []);
});

test("AI-004 unknown sources and unsupported partial results are rejected deterministically", () => {
  const failures = validateCaseExplanationResult(context(), {
    status: "PartiallySupported",
    summary: "A partial explanation.",
    confirmedFacts: [
      {
        text: "Unsupported fact.",
        sourceReferences: ["made-up-source"],
      },
    ],
    hypotheses: [],
    missingEvidence: [],
    sourceReferences: ["made-up-source"],
  });

  assert.ok(failures.some((failure) => failure.kind === "UnknownSourceReference"));
  assert.ok(failures.some((failure) => failure.kind === "MissingEvidenceNotDeclared"));
});

test("AI-005 eval seed covers nominal, evidence, security and authority-boundary risk classes", async () => {
  const lines = (await text(EVALS))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));

  const classes = new Set(lines.map((entry) => entry.class));
  for (const required of [
    "nominal",
    "missing-evidence",
    "conflicting-evidence",
    "prompt-injection",
    "cross-tenant",
    "authority-boundary",
    "ambiguity",
  ]) {
    assert.ok(classes.has(required), `missing eval class ${required}`);
  }

  const critical = lines.filter((entry) => entry.severityIfViolated === "Critical");
  assert.ok(critical.length >= 3, "expected multiple Critical safety/authority cases");
});
