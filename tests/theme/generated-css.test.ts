import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import { generate } from "../../scripts/generate-css";

const themeDir = path.resolve(__dirname, "..", "..", "src", "theme");
const TOKENS_CSS = path.join(themeDir, "tokens.css");
const QUARTO_SCSS = path.join(themeDir, "quarto.scss");

describe("generated theme files", () => {
  it("tokens.css matches the generator output (run `bun run generate-tokens`)", () => {
    const expected = fs.readFileSync(TOKENS_CSS, "utf8");
    const { tokensCss } = generate();
    expect(tokensCss).toBe(expected);
  });

  it("quarto.scss matches the generator output (run `bun run generate-tokens`)", () => {
    const expected = fs.readFileSync(QUARTO_SCSS, "utf8");
    const { quartoScss } = generate();
    expect(quartoScss).toBe(expected);
  });
});
