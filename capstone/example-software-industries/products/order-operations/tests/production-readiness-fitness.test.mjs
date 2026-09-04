import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const PRR = path.join(ROOT, "docs", "production-readiness-review.md");
const OO001 = path.join(
  ROOT,
  "work-items",
  "OO-001-postgresql-escalation-outbox-atomicity.md",
);
const OO002 = path.join(
  ROOT,
  "work-items",
  "OO-002-case-explanation-model-evaluation.md",
);
const OO003 = path.join(
  ROOT,
  "work-items",
  "OO-003-verify-azure-nonprod-deployment.md",
);

async function text(file) {
  return readFile(file, "utf8");
}

test("PRR-001 production readiness review and active closure work items exist", async () => {
  await Promise.all([access(PRR), access(OO001), access(OO002), access(OO003)]);
});

test("PRR-002 current review remains NO-GO while core blockers are open", async () => {
  const body = await text(PRR);

  assert.match(body, /Current decision[\s\S]*NO-GO — evidence closure required/i);

  for (const blocker of [
    "PRB-001",
    "PRB-002",
    "PRB-003",
    "PRB-004",
    "PRB-005",
    "PRB-006",
  ]) {
    assert.ok(body.includes(blocker), `missing core blocker ${blocker}`);
  }

  assert.match(body, /PRB-001[\s\S]*Status:[\s\S]*Open/i);
  assert.match(body, /PRB-006[\s\S]*Status:[\s\S]*Open/i);
});

test("PRR-003 capability-specific launch boundaries do not inherit false readiness", async () => {
  const body = await text(PRR);

  assert.match(body, /LB-ESCALATION[\s\S]*BLOCKED/i);
  assert.match(body, /LB-PRIORITY-CANDIDATE[\s\S]*NOT AUTHORIZED/i);
  assert.match(body, /LB-AI[\s\S]*NOT READY \/ DISABLED FOR CORE LAUNCH/i);
  assert.match(body, /OO-001[\s\S]*execution Pending/i);
  assert.match(body, /OO-002[\s\S]*execution Pending/i);
});

test("PRR-004 production readiness preserves claim-to-evidence boundaries", async () => {
  const body = await text(PRR);

  assert.match(body, /Claim[\s\S]*Required evidence[\s\S]*Current evidence[\s\S]*Limitations/i);
  assert.match(body, /PostgreSQL transaction semantics[\s\S]*real PostgreSQL/i);
  assert.match(body, /Azure private connectivity\/RBAC[\s\S]*real Azure non-production environment/i);
  assert.match(body, /AI groundedness[\s\S]*real model execution against versioned eval set/i);
  assert.match(body, /continuity[\s\S]*actual secondary-maintainer drill/i);
});

test("PRR-005 OO-003 cannot green the PRR by weakening launch evidence", async () => {
  const body = await text(OO003);

  assert.match(body, /Do not modify the PRR to `READY` as part of implementation/i);
  assert.match(body, /Closing `PRB-001` does not automatically close `PRB-002…PRB-006`/i);
  assert.match(body, /public Internet exposure not already approved/i);
  assert.match(body, /production credentials\/customer data/i);
  assert.match(body, /Execution\s+= Pending/i);
  assert.match(body, /PRB-001\s+= Open/i);
});
