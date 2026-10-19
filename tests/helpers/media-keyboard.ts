import { expect, type Locator, type Page } from "@playwright/test";

// Traverse the real sequence, including view links, pannable details and disclosures.
export async function tabTo(page: Page, destination: Locator, reverse = false) {
  if (!await destination.isVisible()) {
    const source = destination.locator("xpath=ancestor::details[1]");
    if (await source.count()) {
      await tabTo(page, source.locator(":scope > summary"), reverse);
      await page.keyboard.press("Enter");
      await expect(source).toHaveAttribute("open", "");
      // The disclosed link follows its summary, including after reaching that
      // summary by traversing backward through the page.
      reverse = false;
    }
  }
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press(reverse ? "Shift+Tab" : "Tab");
    if (await destination.evaluate(element => element === document.activeElement)) return;
  }
  await expect(destination).toBeFocused();
}
