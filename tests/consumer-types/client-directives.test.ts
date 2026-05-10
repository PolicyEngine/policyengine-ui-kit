import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname, '..', '..');
const DIST_INDEX = path.join(ROOT, 'dist', 'index.js');
const DIST_LAYOUT = path.join(ROOT, 'dist', 'layout.js');

const distAvailable =
  fs.existsSync(DIST_INDEX) && fs.existsSync(DIST_LAYOUT);

describe('client directives in built artifacts', () => {
  if (!distAvailable) {
    it.skip('(skipped — run `bun run build` first to inspect dist/ artifacts)', () => {});
    return;
  }

  it('marks shell entrypoints as client modules for Next App Router consumers', () => {
    for (const file of [DIST_INDEX, DIST_LAYOUT]) {
      expect(fs.readFileSync(file, 'utf8').startsWith('"use client";')).toBe(true);
    }
  });
});
