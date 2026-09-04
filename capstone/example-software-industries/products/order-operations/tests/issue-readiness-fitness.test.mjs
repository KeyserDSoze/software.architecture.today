import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const TEMPLATE = path.join(ROOT, "work-items", "TEMPLATE.md");
const OO001 = path.join(
  ROOT,
  "work-items",
  "OO-001-postgresql-escalation-outbox-atomicity.md",
);

const REQUIRED_SECTIONS = [
  "## Problem",
  "## Outcome",
  "## Current evidence",
  "## Scope",
  "## Out of scope",
  "## Canonical context",
  "## Acceptance criteria",
  "## Verification",
  "## Constraints",
  "## Stop conditions",
  "## Closure evidence",
];

async function text(file) {
  return readFile(file, "utf8");
}

function expectSections(fileName, body) {
  for (const section of REQUIRED_SECTIONS) {
    assert.ok(body.includes(section), `${fileName} is missing ${section}`);
  }
}

test("ISSUE-001 work item template and first execution issue exist", async () => {
  await Promise.all([access(TEMPLATE), access(OO001)]);
});

test("ISSUE-002 execution work items preserve the minimum execution contract", async () => {
  const [template, issue] = await Promise.all([text(TEMPLATE), text(OO001)]);
  expectSections("TEMPLATE.md", template);
  expectSections("OO-001", issue);
});

test("ISSUE-003 OO-001 routes to canonical repository context", async () => {
  const issue = await text(OO001);
  const requiredRefs = [
    "AGENTS.md",
    "docs/repository-map.md",
    "docs/testing-strategy.md",
    "docs/data-ownership.md",
    "docs/failure-mode-map.md",
    "database/migrations/001_create_operational_case.sql",
    "database/migrations/002_add_payment_escalation_and_outbox.sql",
  ];

  for (const ref of requiredRefs) {
    assert.ok(issue.includes(ref), `OO-001 is missing canonical reference ${ref}`);
  }
});

test("ISSUE-004 OO-001 protects the verification oracle and evidence boundary", async () => {
  const issue = await text(OO001);

  assert.match(issue, /rewrite migration `001` or `002` merely to make the test pass/i);
  assert.match(issue, /Stop conditions/i);
  assert.match(issue, /Not verified/i);
  assert.match(issue, /real PostgreSQL engine required/i);
});
