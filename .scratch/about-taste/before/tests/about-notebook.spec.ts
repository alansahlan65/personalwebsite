import { expect, test } from "@playwright/test";

test("the notebook tells Alan's confirmed interests and lets visitors explore each", async ({ page }) => {
  await page.goto("/about");
  const notebook = page.getByRole("group", { name: "Notes about Alan" });
  await expect(page.getByText("Designer. Movie watcher. Gamer. History reader.", { exact: true })).toBeVisible();
  await expect(notebook.getByRole("heading", { name: "Lost in a good story." })).toBeVisible();
  await notebook.getByRole("button", { name: "Next scene" }).click();
  await expect(notebook.getByText("A little plot twist", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Read gaming note" }).click();
  await expect(notebook.getByRole("heading", { name: "Just one more round." })).toBeVisible();
  for (let index = 1; index <= 3; index++) await notebook.getByRole("button", { name: `Collect detail ${index}` }).click();
  await expect(notebook.getByText("Side quest complete!", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Collect detail 1" }).click();
  await expect(notebook.getByText("Side quest complete!", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Play again" }).click();
  await expect(notebook.getByText("0 / 3 little details", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Read history note" }).click();
  await expect(notebook.getByText("How did we get here?", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Turn the page" }).click();
  await expect(notebook.getByText("What happened next?", { exact: true })).toBeVisible();
  await notebook.getByRole("button", { name: "Read next note" }).click();
  await expect(notebook.getByText("A little plot twist", { exact: true })).toBeVisible();
});

test("the note deck supports pointer swipes and resets its drag position", async ({ page }) => {
  await page.goto("/about");
  const title = page.getByRole("heading", { name: "Lost in a good story." });
  await title.scrollIntoViewIfNeeded();
  const bounds = await title.boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + 10);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 - 140, bounds!.y + 10, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByRole("button", { name: "Read gaming note" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Just one more round." })).toBeVisible();
  await expect.poll(async () => page.locator('[data-front]').evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41))).toBeLessThan(1);
});

test("keyboard readers select notes and use the scene controls with stationary feedback", async ({ page }) => {
  await page.goto("/about");
  const history = page.getByRole("button", { name: "Read history note" });
  await history.focus();
  await page.keyboard.press("Enter");
  await expect(history).toBeFocused();
  await expect(page.locator('[data-notebook]')).toHaveAttribute("data-still");
  const turn = page.getByRole("button", { name: "Turn the page" });
  await turn.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("What happened next?", { exact: true })).toBeVisible();
  expect(await turn.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe("none");
  await page.getByRole("button", { name: "Explore building perspective" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Learn the constraints. Make the details respond.", { exact: true })).toBeVisible();
});

test("touch visitors explore hobbies and the side quest using taps", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/about");
  await page.getByRole("button", { name: "Read gaming note" }).tap();
  for (let index = 1; index <= 3; index++) await page.getByRole("button", { name: `Collect detail ${index}` }).tap();
  await expect(page.getByText("Side quest complete!", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Read history note" }).tap();
  await page.getByRole("button", { name: "Turn the page" }).tap();
  await expect(page.getByText("What happened next?", { exact: true })).toBeVisible();
  await context.close();
});

for (const width of [320, 390, 768, 1440]) {
  test(`the personal details fit at ${width}px with normal and enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    for (const size of [100, 200]) {
      await page.addStyleTag({ content: `html { font-size: ${size}%; }` });
      for (const name of ["Read movies note", "Read gaming note", "Read history note"]) {
        await page.getByRole("button", { name }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      await page.getByRole("button", { name: "Explore building perspective" }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Read movies note" }).click();
    expect(await page.locator('[data-front]').evaluate(node => getComputedStyle(node).transform)).toBe("none");
  });
}

test("personal interests remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Lost in a good story." })).toBeVisible();
  await expect(page.getByText("A little further back.", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Just one more round.", { exact: true }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Meet the human" })).toHaveAttribute("href", "#about-story-title");
  await context.close();
});
