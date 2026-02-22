import { expect, test } from "@playwright/test";

const visualCases = [
  { id: "components-button--primary", file: "button-primary.png" },
  { id: "components-dialog--open", file: "dialog-open.png" },
  { id: "components-tabs--default", file: "tabs-default.png" },
  { id: "components-select--default", file: "select-default.png" },
  { id: "components-formfield--invalid", file: "formfield-invalid.png" },
  { id: "components-toast--success", file: "toast-success.png" }
];

for (const visualCase of visualCases) {
  test(`storybook visual baseline: ${visualCase.id}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${visualCase.id}&viewMode=story`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(100);
    await expect(page.locator("#storybook-root")).toHaveScreenshot(visualCase.file);
  });
}
