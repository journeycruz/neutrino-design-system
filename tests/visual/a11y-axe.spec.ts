import * as axe from "axe-core";
import { expect, test, type Page } from "@playwright/test";

const criticalStories = [
  "components-dialog--open",
  "components-dialog--nested-static",
  "components-tabs--default",
  "components-tabs--with-disabled",
  "components-formfield--invalid",
  "components-formfield--native-textarea",
  "components-formfield--composed-input",
  "components-formfield--composed-checkbox",
  "components-formfield--composed-radio",
  "components-input--default",
  "components-select--invalid",
  "components-checkbox--disabled",
  "components-switch--disabled"
];

type AxeViolation = {
  id: string;
  impact: string | null;
  nodes: number;
};

async function scanStoryForAxeViolations(page: Page, storyId: string): Promise<AxeViolation[]> {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await expect(page.locator("#storybook-root")).toBeVisible();

  await page.addScriptTag({ content: axe.source });

  return page.evaluate(async () => {
    const axeGlobal = (window as unknown as Window & {
      axe: {
        run: (
          context?: Element | Document,
          options?: unknown
        ) => Promise<{ violations: Array<{ id: string; impact: string | null; nodes: unknown[] }> }>;
      };
    }).axe;

    const result = await axeGlobal.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"]
      }
    });

    return result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length
    }));
  });
}

for (const storyId of criticalStories) {
  test(`axe regression: ${storyId}`, async ({ page }) => {
    const violations = await scanStoryForAxeViolations(page, storyId);
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}
