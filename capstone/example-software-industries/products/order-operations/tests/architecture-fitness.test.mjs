import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_ROOT = path.resolve(HERE, "..");
const SRC_ROOT = path.join(PRODUCT_ROOT, "src");

async function sourceFiles(dir = SRC_ROOT) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await sourceFiles(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(absolute);
    }
  }

  return files.sort();
}

function importSpecifiers(source) {
  const result = [];
  const pattern = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    result.push(match[1]);
  }

  return result;
}

function relativeFromSrc(file) {
  return path.relative(SRC_ROOT, file).split(path.sep).join("/");
}

function resolveRelativeImport(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;

  const absolute = path.resolve(path.dirname(fromFile), specifier);
  return path.relative(SRC_ROOT, absolute).split(path.sep).join("/");
}

async function importsByFile() {
  const files = await sourceFiles();
  const result = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    result.push({
      file,
      relativeFile: relativeFromSrc(file),
      imports: importSpecifiers(source),
    });
  }

  return result;
}

function violationsForRule(rows, predicate) {
  const violations = [];

  for (const row of rows) {
    for (const specifier of row.imports) {
      const target = resolveRelativeImport(row.file, specifier);
      if (predicate({ ...row, specifier, target })) {
        violations.push(`${row.relativeFile} -> ${specifier}`);
      }
    }
  }

  return violations;
}

function expectNoViolations(ruleId, violations, guidance) {
  assert.deepEqual(
    violations,
    [],
    `${ruleId} violated. ${guidance}\n${violations.join("\n")}`,
  );
}

test("AF-001 target source does not import Operations Desk Classic directly", async () => {
  const rows = await importsByFile();
  const violations = violationsForRule(rows, ({ specifier }) =>
    specifier.includes("operations-desk-classic") || specifier.includes("/legacy/"),
  );

  expectNoViolations(
    "AF-001 Legacy isolation",
    violations,
    "Keep legacy behavior behind an explicit adapter/port instead of importing legacy implementation into target source.",
  );
});

test("AF-002 application does not depend on integration", async () => {
  const rows = await importsByFile();
  const violations = violationsForRule(
    rows,
    ({ relativeFile, target }) =>
      relativeFile.startsWith("application/") &&
      target !== null &&
      target.startsWith("integration/"),
  );

  expectNoViolations(
    "AF-002 Application dependency direction",
    violations,
    "Application behavior should depend on ports/contracts, not infrastructure mechanisms.",
  );
});

test("AF-003 contracts remain independent from implementation layers", async () => {
  const rows = await importsByFile();
  const forbidden = ["application/", "integration/", "observability/", "priority/"];
  const violations = violationsForRule(
    rows,
    ({ relativeFile, target }) =>
      relativeFile.startsWith("contracts/") &&
      target !== null &&
      forbidden.some((prefix) => target.startsWith(prefix)),
  );

  expectNoViolations(
    "AF-003 Contract independence",
    violations,
    "Keep contract definitions independent from application and implementation layers.",
  );
});

test("AF-004 priority policy does not depend on integration or observability implementation", async () => {
  const rows = await importsByFile();
  const violations = violationsForRule(
    rows,
    ({ relativeFile, target }) =>
      relativeFile.startsWith("priority/") &&
      target !== null &&
      (target.startsWith("integration/") || target.startsWith("observability/")),
  );

  expectNoViolations(
    "AF-004 Priority isolation",
    violations,
    "Keep priority semantics independently testable and free from integration/telemetry implementation coupling.",
  );
});

test("AF-005 core semantic layers do not import Azure SDK packages", async () => {
  const rows = await importsByFile();
  const semanticPrefixes = ["application/", "contracts/", "priority/"];
  const violations = violationsForRule(
    rows,
    ({ relativeFile, specifier }) =>
      semanticPrefixes.some((prefix) => relativeFile.startsWith(prefix)) &&
      specifier.startsWith("@azure/"),
  );

  expectNoViolations(
    "AF-005 Vendor SDK boundary",
    violations,
    "Move Azure-specific behavior behind an integration adapter or reopen the architectural decision with evidence.",
  );
});
