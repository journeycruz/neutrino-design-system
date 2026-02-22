import { expect, test } from "@playwright/test";

test("dialog keyboard and focus lifecycle stays stable", async ({ page }) => {
  await page.goto("/iframe.html?id=components-dialog--default&viewMode=story");
  await page.waitForLoadState("networkidle");

  const openButton = page.getByRole("button", { name: "Open dialog" });
  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Archive project" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(openButton).toBeFocused();

});

test("tabs keyboard navigation and ARIA bindings remain correct", async ({ page }) => {
  await page.goto("/iframe.html?id=components-tabs--default&viewMode=story");
  await page.waitForLoadState("networkidle");

  const overviewTab = page.getByRole("tab", { name: "Overview" });
  await overviewTab.focus();

  await page.keyboard.press("ArrowRight");
  const tokensTab = page.getByRole("tab", { name: "Tokens" });
  await expect(tokensTab).toBeFocused();

  await page.keyboard.press("End");
  const accessibilityTab = page.getByRole("tab", { name: "Accessibility" });
  await expect(accessibilityTab).toBeFocused();

  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("A11y checklist");
  const activeTabId = await accessibilityTab.getAttribute("id");
  expect(activeTabId).not.toBeNull();
  await expect(panel).toHaveAttribute("aria-labelledby", activeTabId ?? "");

});

test("tabs keyboard navigation skips disabled tabs", async ({ page }) => {
  await page.goto("/iframe.html?id=components-tabs--with-disabled&viewMode=story");
  await page.waitForLoadState("networkidle");

  const overviewTab = page.getByRole("tab", { name: "Overview" });
  const tokensTab = page.getByRole("tab", { name: "Tokens" });
  const accessibilityTab = page.getByRole("tab", { name: "Accessibility" });

  await expect(tokensTab).toBeDisabled();
  await overviewTab.focus();
  await page.keyboard.press("ArrowRight");

  await expect(accessibilityTab).toBeFocused();
  await expect(accessibilityTab).toHaveAttribute("aria-selected", "true");
});

test("nested dialog close restores focus to outer trigger", async ({ page }) => {
  await page.goto("/iframe.html?id=components-dialog--nested-static&viewMode=story");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Open outer dialog" }).click();
  const openInnerButton = page.getByRole("button", { name: "Open inner dialog" });
  await openInnerButton.click();

  await expect(page.getByRole("dialog", { name: "Inner dialog" })).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog", { name: "Inner dialog" })).toBeHidden();
  await expect(openInnerButton).toBeFocused();
});
