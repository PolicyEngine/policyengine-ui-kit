/**
 * A tool listed in the PolicyEngine header's Tools menu: a calculator that
 * works for any household under current law. Research about one policy, bill
 * or event stays out of the menu, however interactive it is.
 *
 * Each tool is its own zone on policyengine.org at `/<country>/<slug>`, so a
 * link to one must be a full page load, never a client-side transition.
 */
export interface PolicyEngineTool {
  /** Path segment after the country: the tool lives at `/<country>/<slug>`. */
  readonly slug: string;
  readonly label: string;
}

/** The Tools menu's first row, which links to the main app. */
export const POLICYENGINE_APP_LABEL = 'PolicyEngine app';

/** Where the main app lives; it serves `/<country>`. */
export const DEFAULT_POLICYENGINE_APP_URL = 'https://app.policyengine.org';

function freezeTools(
  tools: PolicyEngineTool[],
): readonly PolicyEngineTool[] {
  return Object.freeze(tools.map((tool) => Object.freeze({ ...tool })));
}

/**
 * Each country's tools, sorted by label. A country with no entry has no
 * Tools menu.
 *
 * policyengine.org builds the same menu from the `toolsMenu` labels in
 * PolicyEngine/policyengine-app-v2's `app/src/data/apps/apps.json`, which
 * ui-kit can't import. `tests/layout/toolsMenuParity.network.test.ts` fails
 * when this copy, the main app's label or its URL differ from app-v2's, so
 * change them when apps.json changes. The data is frozen because every
 * header in a bundle shares it.
 */
export const policyEngineTools: Readonly<
  Partial<Record<string, readonly PolicyEngineTool[]>>
> = Object.freeze({
  us: freezeTools([
    { slug: 'cliffwatch', label: 'CliffWatch' },
    { slug: 'coverage-compass', label: 'Coverage Compass' },
    { slug: 'givecalc', label: 'GiveCalc' },
    { slug: 'marriage', label: 'Marriage calculator' },
    { slug: 'qbi-calculator', label: 'QBI deduction calculator' },
    { slug: 'spm-calculator', label: 'SPM threshold calculator' },
    { slug: 'tanf-calculator', label: 'TANF calculator' },
  ]),
  uk: freezeTools([
    { slug: 'marriage', label: 'Marriage calculator' },
    { slug: 'uk-student-loan-calculator', label: 'Student loan calculator' },
    { slug: 'uk-cliff-watch', label: 'UK CliffWatch' },
  ]),
});
