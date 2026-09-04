import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const DELEGATION = path.join(ROOT, "docs", "agent-delegation-contract.md");
const VERIFICATION = path.join(ROOT, "docs", "agent-verification-bundle.md");
const AUTONOMY = path.join(ROOT, "docs", "ai-autonomy-matrix.md");
const OO001 = path.join(
  ROOT,
  "work-items",
  "OO-001-postgresql-escalation-outbox-atomicity.md",
);

async function text(file) {
  return readFile(file, "utf8");
}

test("AGOV-001 governance artifacts exist", async () => {
  await Promise.all([
    access(DELEGATION),
    access(VERIFICATION),
    access(AUTONOMY),
    access(OO001),
  ]);
});

test("AGOV-002 delegation contract remains bounded to OO-001 and A2", async () => {
  const body = await text(DELEGATION);

  assert.match(body, /ADC-OO-001-v1/);
  assert.match(body, /OO-001/);
  assert.match(body, /A2 — Execute \+ verify in bounded environment/);
  assert.match(body, /merge default branch/i);
  assert.match(body, /production credentials/i);
  assert.match(body, /increase its own autonomy level/i);
  assert.match(body, /Stop conditions/i);
});

test("AGOV-003 verification bundle preserves claim-to-evidence and limitations", async () => {
  const body = await text(VERIFICATION);

  for (const claim of ["C-01", "C-02", "C-03", "C-04", "C-05"]) {
    assert.ok(body.includes(claim), `missing required claim ${claim}`);
  }

  assert.match(body, /Primary evidence/i);
  assert.match(body, /Independent verification rubric/i);
  assert.match(body, /Known limitations/i);
  assert.match(body, /Not verified/i);
  assert.match(body, /Pending execution/i);
});

test("AGOV-004 autonomy matrix keeps high-impact decisions behind human gates", async () => {
  const body = await text(AUTONOMY);

  assert.match(body, /Merge default branch \| Human\/repository gate/i);
  assert.match(body, /Execute destructive production DB mutation \| A0/i);
  assert.match(body, /Access production secrets\/customer data \| Forbidden/i);
  assert.match(body, /Introduce new authoritative data owner \| A0/i);
  assert.match(body, /may not unilaterally update this matrix/i);
});

test("AGOV-005 governance artifacts do not claim OO-001 execution is complete", async () => {
  const [delegation, verification, autonomy] = await Promise.all([
    text(DELEGATION),
    text(VERIFICATION),
    text(AUTONOMY),
  ]);

  assert.match(delegation, /OO-001 PostgreSQL execution\s+Not yet executed/i);
  assert.match(verification, /Status: Pending execution/i);
  assert.match(autonomy, /Observed agent reliability\s+No production dataset yet/i);
});
