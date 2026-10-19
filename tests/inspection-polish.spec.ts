import { expect, test } from "@playwright/test";

for (const slug of ["pawfriend"]) {
  test(`${slug} view links select panels, keep history and reveal original sources`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/work/${slug}`);
    const sequence = page.locator(".case-media");
    await expect(sequence).toHaveAttribute("data-horizontal", "true");
    const views = sequence.locator(".case-media-panel-nav a");
    await expect(views).toHaveCount(3);
    for (const index of [2, 0, 1]) {
      await views.nth(index).focus();
      await page.keyboard.press("Enter");
      const heading = sequence.getByRole("article").nth(index).getByRole("heading");
      await expect(heading).toBeFocused();
      await expect(heading).toBeInViewport({ ratio: 1 });
      await expect(views.nth(index)).toHaveAttribute("aria-current", "location");
      await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", String(index + 1));
    }
    await page.goBack();
    await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "1");
    await page.reload();
    await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "1");
    const disclosure = sequence.getByRole("article").first().locator("summary");
    await disclosure.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure.locator("..")).toHaveAttribute("open", "");
    await expect(sequence.getByRole("article").first().getByRole("img")).toHaveCount(2);
    await expect(disclosure).toBeInViewport({ ratio: 1 });
    await page.keyboard.press("Space");
    await expect(disclosure.locator("..")).not.toHaveAttribute("open", "");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await views.last().click();
    await expect(sequence.getByRole("article").last().getByRole("heading")).toBeFocused();
    await expect(sequence.getByRole("article").last().getByRole("heading")).toBeInViewport({ ratio: 1 });
  });
}

test("phone hero provides a shorter path to selected work and clear compact navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator(".work").evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(844);
  const shortcut = page.getByRole("link", { name: "Selected work", exact: true });
  await shortcut.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#work")).toBeFocused();
  const rail = page.locator(".compact-menu-rail");
  await expect(rail).toHaveClass(/is-visible/);
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  const triggerBounds = (await trigger.boundingBox())!;
  const railBounds = (await rail.boundingBox())!;
  expect(triggerBounds.y).toBeGreaterThanOrEqual(railBounds.y);
  expect(triggerBounds.y + triggerBounds.height).toBeLessThanOrEqual(railBounds.y + railBounds.height);
  await page.locator(".project-link").first().focus();
  expect((await page.locator(".project-link").first().boundingBox())!.y).toBeGreaterThanOrEqual(railBounds.height);
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("copy recovery assembles the current draft without invoking an email handler", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } });
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Email address copied.");
  expect(await page.locator("html").getAttribute("data-copied")).toBe("alansahlanwork@gmail.com");
  await page.getByRole("button", { name: "Copy message", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Your message", exact: true })).toBeFocused();
  await page.getByRole("textbox", { name: "Your message", exact: true }).fill("A message with & and a new line.\nPlease keep this draft.");
  await page.getByRole("button", { name: "Copy message", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Message copied. Paste it into your email app.");
  expect(await page.locator("html").getAttribute("data-copied")).toBe("Subject: Hello Alan\n\nA message with & and a new line.\nPlease keep this draft.");
  await expect(page.getByRole("link", { name: "Reopen email draft", exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Your message", exact: true })).toHaveValue(/Please keep this draft/);
});

test("denied clipboard provides selected text and clears stale recovery after editing", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Denied"); } } });
  });
  await page.goto("/contact");
  const message = page.getByRole("textbox", { name: "Your message", exact: true });
  await message.fill("Please discuss this project with me.");
  await page.getByRole("button", { name: "Copy message", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Couldn't copy. Copy the selected text below.");
  const manual = page.getByRole("textbox", { name: "Message to copy", exact: true });
  await expect(manual).toBeFocused();
  await expect(manual).toHaveAttribute("readonly", "");
  expect(await manual.evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBe((await manual.inputValue()).length);
  await message.fill("Updated project message.");
  await expect(manual).toHaveCount(0);
  await expect(page.getByRole("status")).toBeEmpty();
  await expect(message).toHaveValue("Updated project message.");
});

test("native mobile source links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/paylecta");
  const image = page.getByRole("link", { name: "Open Paylecta visual system at full size" });
  await image.focus();
  await expect(image).toBeInViewport();
  const source = page.getByRole("link", { name: "Read the original Paylecta case study PDF", exact: true });
  await source.focus();
  await expect(source).toBeInViewport();
  await expect(source).toHaveAttribute("href", /drive\.google\.com\/file\/d\//);
  await context.close();
});

test("enlarged phone menu keeps whole words and scrolls to every destination", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await page.evaluate(() => scrollTo(0, 700));
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const labels = page.locator(".stairs-static-label");
  await expect(labels).toHaveCount(4);
  expect(await labels.first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(64);
  const brokenWords = await labels.evaluateAll(elements => elements.flatMap(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const broken: string[] = [];
    let text: Node | null;
    while ((text = walker.nextNode())) {
      for (const match of text.textContent!.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(text, match.index!);
        range.setEnd(text, match.index! + match[0].length);
        if (range.getClientRects().length !== 1) broken.push(match[0]);
      }
    }
    return broken;
  }));
  expect(brokenWords).toEqual([]);
  const resume = page.getByRole("dialog").getByRole("link", { name: "Download resume, PDF", exact: true });
  await resume.focus();
  await expect(resume).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
