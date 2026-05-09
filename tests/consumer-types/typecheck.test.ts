import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/**
 * Consumer-style typecheck harness.
 *
 * Real consumers see ui-kit through `package.json` `exports`, with
 * `moduleResolution: "bundler"` (Next.js, Vite, anything modern). When
 * `dist/<name>.js` and `dist/<name>/index.d.ts` coexist, TypeScript's
 * bundler resolver historically prefers the file (no types) and silently
 * drops every `export *` symbol — see PR #29 and PR #30. This harness
 * type-checks `tests/consumer-types/fixture.ts` against the *built*
 * package via `paths` mappings to `dist/`, so any regression on that
 * resolution path fails CI loudly instead of in 36 downstream consumer
 * repos a release later.
 *
 * Run after `bun run build`. The harness skips with an actionable message
 * when `dist/` is missing.
 */

const ROOT = path.resolve(__dirname, "..", "..");
const TS_BIN = path.join(ROOT, "node_modules", ".bin", "tsc");
const FIXTURE_TSCONFIG = path.join(__dirname, "tsconfig.json");
const DIST_INDEX = path.join(ROOT, "dist", "index.d.ts");

// Skip the harness when dist/ is missing so a fresh `bun run test` doesn't
// fail before `bun run build` ever runs. CI runs build before tests; local
// runs typically already have dist/ from a prior build cycle. We use a
// visible `it.skip` (not `describe.skipIf`) so the test report shows a
// "skipped" line with an actionable hint instead of silently dropping the
// test — that way a dev who runs `bun run test` cold can see *why* the
// harness didn't fire.
const distAvailable = fs.existsSync(DIST_INDEX);

describe("consumer-style type resolution", () => {
  if (!distAvailable) {
    it.skip("(skipped — run `bun run build` first to exercise the typecheck harness against dist/)", () => {});
    return;
  }

  it("main + legacy + per-feature subpaths all type-check from a bundler-resolution consumer", () => {
    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    try {
      stdout = execFileSync(TS_BIN, ["--noEmit", "-p", FIXTURE_TSCONFIG], {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      // execFileSync throws on non-zero exit; capture output for the assertion.
      const e = err as NodeJS.ErrnoException & {
        stdout?: Buffer | string;
        stderr?: Buffer | string;
        status?: number;
      };
      stdout = e.stdout?.toString() ?? "";
      stderr = e.stderr?.toString() ?? "";
      exitCode = e.status ?? 1;
    }

    if (exitCode !== 0) {
      throw new Error(
        `tsc reported errors against tests/consumer-types/fixture.ts ` +
          `(exit ${exitCode}). This means a real consumer with ` +
          `moduleResolution: "bundler" would fail to import these symbols.\n\n` +
          `=== tsc stdout ===\n${stdout}\n=== tsc stderr ===\n${stderr}`,
      );
    }
    expect(exitCode).toBe(0);
  });
});
