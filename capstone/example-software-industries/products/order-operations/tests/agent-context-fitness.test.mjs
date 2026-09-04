import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_ROOT = path.resolve(HERE, "..");

async function exists(relativePath) {
  try {
    await access(path.join(PRODUCT_ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

test("CTX-001 agent entry point and repository map exist", async () => {
  assert.equal(await exists("AGENTS.md"), true, "Missing AGENTS.md agent entry point");
  assert.equal(
    await exists("docs/repository-map.md"),
    true,
    "Missing docs/repository-map.md navigation context",
  );
});

test("CTX-002 canonical documents referenced by the operating context exist", async () => {
  const canonicalDocs = [
    "docs/functional-analysis.md",
    "docs/requirements.md",
    "docs/priority-functional-analysis.md",
    "docs/legacy-understanding-map.md",
    "docs/refactoring-safety-plan.md",
    "docs/api-contract.md",
    "docs/data-ownership.md",
    "docs/failure-mode-map.md",
    "docs/cloud-deployment.md",
    "docs/threat-model.md",
    "docs/security-control-matrix.md",
    "docs/reliability-contract.md",
    "docs/observability-contract.md",
    "docs/testing-strategy.md",
    "docs/architecture-fitness-checklist.md",
    "docs/cost-model.md",
  ];

  const missing = [];
  for (const relativePath of canonicalDocs) {
    if (!(await exists(relativePath))) missing.push(relativePath);
  }

  assert.deepEqual(
    missing,
    [],
    `Repository operating context references missing canonical documents:\n${missing.join("\n")}`,
  );
});

test("CTX-003 golden verification commands exist in package scripts", async () => {
  const packageJson = JSON.parse(
    await readFile(path.join(PRODUCT_ROOT, "package.json"), "utf8"),
  );

  assert.equal(
    typeof packageJson.scripts?.typecheck,
    "string",
    "AGENTS.md declares npm run typecheck, but package.json has no typecheck script",
  );
  assert.equal(
    typeof packageJson.scripts?.test,
    "string",
    "AGENTS.md declares npm test, but package.json has no test script",
  );
});

test("CTX-004 AGENTS.md routes to the repository map and declares evidence discipline", async () => {
  const agents = await readFile(path.join(PRODUCT_ROOT, "AGENTS.md"), "utf8");

  assert.match(
    agents,
    /docs\/repository-map\.md/,
    "AGENTS.md must route contributors to the canonical Repository Map",
  );
  assert.match(agents, /npm run typecheck/, "AGENTS.md must declare the typecheck gate");
  assert.match(agents, /npm test/, "AGENTS.md must declare the test gate");
  assert.match(
    agents,
    /Designed\s*→\s*Codified\s*→\s*Verified\s*→\s*Monitored/,
    "AGENTS.md must preserve the repository evidence vocabulary",
  );
});
