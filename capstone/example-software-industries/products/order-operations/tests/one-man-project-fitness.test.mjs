import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const OPERATING_MODEL = path.join(
  ROOT,
  "docs",
  "one-man-project-operating-model.md",
);
const OO002 = path.join(
  ROOT,
  "work-items",
  "OO-002-case-explanation-model-evaluation.md",
);
const AI_CONTRACT = path.join(ROOT, "docs", "ai-feature-contract.md");
const REPOSITORY_MAP = path.join(ROOT, "docs", "repository-map.md");
const AGENTS = path.join(ROOT, "AGENTS.md");

async function text(file) {
  return readFile(file, "utf8");
}

test("OMP-001 operating model and OO-002 artifacts exist", async () => {
  await Promise.all([
    access(OPERATING_MODEL),
    access(OO002),
    access(AI_CONTRACT),
    access(REPOSITORY_MAP),
    access(AGENTS),
  ]);
});

test("OMP-002 operating model separates accountable lead from unilateral authority", async () => {
  const body = await text(OPERATING_MODEL);

  assert.match(body, /Accountable Project Lead/i);
  assert.match(body, /Secondary Maintainer/i);
  assert.match(body, /May propose but not unilaterally approve/i);
  assert.match(body, /payment\/economic side effects/i);
  assert.match(body, /security exception/i);
  assert.match(body, /Decision rights and specialist triggers/i);
});

test("OMP-003 WIP and continuity are explicit and continuity is not falsely verified", async () => {
  const body = await text(OPERATING_MODEL);

  assert.match(body, /Max active execution tasks\s+2/i);
  assert.match(body, /Max active cross-boundary tasks\s+1/i);
  assert.match(body, /Continuity \/ vacation drill/i);
  assert.match(body, /not yet executed/i);
  assert.match(body, /A file existing is not continuity evidence/i);
  assert.match(body, /Exit triggers/i);
});

test("OMP-004 OO-002 preserves common eval oracle and remains pending", async () => {
  const body = await text(OO002);

  assert.match(body, /OO-002/);
  assert.match(body, /same versioned Case Explanation eval suite/i);
  assert.match(body, /No oracle laundering/i);
  assert.match(body, /Do not activate another T2 task concurrently/i);
  assert.match(body, /OO-002 execution\s+= Not started \/ Pending/i);
  assert.match(body, /Model\/provider decision\s+= Pending/i);
});

test("OMP-005 model selection remains bounded by the existing AI authority contract", async () => {
  const [operating, workItem, aiContract] = await Promise.all([
    text(OPERATING_MODEL),
    text(OO002),
    text(AI_CONTRACT),
  ]);

  assert.match(operating, /Case Explanation Assistant/i);
  assert.match(workItem, /grant the model write\/remediation tools/i);
  assert.match(workItem, /Production credentials and customer data are forbidden/i);
  assert.match(aiContract, /Model output[\s\S]*advisory interpretation only/i);
});
