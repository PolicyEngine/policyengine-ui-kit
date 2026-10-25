/**
 * An interactive tool listed in the PolicyEngine header's Tools menu.
 *
 * Each tool is its own zone on policyengine.org at `/<country>/<slug>`, so a
 * link to one must be a full page load, never a client-side transition.
 */
export interface PolicyEngineFeaturedTool {
  /** Path segment after the country: the tool lives at `/<country>/<slug>`. */
  readonly slug: string;
  readonly label: string;
  readonly description: string;
}

function freezeTools(
  tools: PolicyEngineFeaturedTool[],
): readonly PolicyEngineFeaturedTool[] {
  return Object.freeze(tools.map((tool) => Object.freeze({ ...tool })));
}

/**
 * The featured tools for each country, in menu order.
 *
 * This mirrors `app/src/data/featuredTools.json` in
 * PolicyEngine/policyengine-app-v2, which drives policyengine.org's own
 * header and homepage. `tests/layout/featuredToolsParity.test.ts` fails when
 * the two lists differ, so change both together. A country with no entry has
 * no Tools menu. The data is frozen because every header in a bundle shares
 * it.
 */
export const policyEngineFeaturedTools: Readonly<
  Partial<Record<string, readonly PolicyEngineFeaturedTool[]>>
> = Object.freeze({
  us: freezeTools([
    {
      slug: 'cliffwatch',
      label: 'CliffWatch',
      description:
        "See where benefits, refundable tax credits, and taxes create cliffs as a household's wages rise, in all 50 states and DC.",
    },
    {
      slug: 'obbba-households',
      label: 'OBBBA household explorer',
      description:
        "See how the One Big Beautiful Bill Act changes each modeled household's resources in 2026, and which provisions drive the change.",
    },
    {
      slug: 'bill-tracker',
      label: 'State legislative tracker',
      description:
        "Monitor tax and benefit legislation across all 50 US states. See which states are in session, track active bills, and explore PolicyEngine's research on state-level policy reforms.",
    },
  ]),
  uk: freezeTools([
    {
      slug: 'uk-cliff-watch',
      label: 'UK CliffWatch',
      description:
        "See where benefit withdrawal and taxes create cliffs and high marginal rates as a UK household's earnings rise.",
    },
  ]),
});
