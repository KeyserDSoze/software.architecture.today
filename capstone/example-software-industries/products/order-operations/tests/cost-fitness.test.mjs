import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_ROOT = path.resolve(HERE, "..");
const BICEP_PATH = path.join(PRODUCT_ROOT, "infra", "main.bicep");

async function bicepSource() {
  return readFile(BICEP_PATH, "utf8");
}

test("CF-001 IaC preserves workload, owner and environment cost-allocation metadata", async () => {
  const source = await bicepSource();

  assert.match(
    source,
    /workload:\s*'order-operations'/,
    "CF-001 violated: workload tag is required for cost allocation and workload ownership.",
  );

  assert.match(
    source,
    /owner:\s*'commerce-operations'/,
    "CF-001 violated: owner tag is required for cost accountability.",
  );

  assert.match(
    source,
    /environment:\s*environmentName/,
    "CF-001 violated: environment metadata is required to separate production and non-production economics.",
  );
});

test("CF-002 cost-center is not fabricated as a hard-coded ESI value", async () => {
  const source = await bicepSource();

  assert.doesNotMatch(
    source,
    /cost[-_]?center\s*:\s*['"][^'"]+['"]/i,
    "CF-002 violated: the book must not invent an organization-specific cost-center mapping in IaC.",
  );
});
