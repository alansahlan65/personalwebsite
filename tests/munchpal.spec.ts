import { expect, test } from "@playwright/test";

test("direct Munchpal entry presents the client design case with original sources", async ({ page }) => {
  await page.goto("/work/munchpal");
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeVisible();
  await expect(page.locator(".case-facts").getByText(/Client design project/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the original Munchpal presentation" })).toHaveAttribute("href", "https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view");
  await expect(page.getByRole("link", { name: "Explore the Munchpal prototype" })).toHaveAttribute("href", /figma\.com\/proto\/Xsj8X9CcL5SW6CoILaZFH3\/MunchPal/);
  const journey = page.getByRole("region", { name: "A request starts with a listing", exact: true });
  await expect(journey.getByRole("img")).toHaveCount(3);
  await expect(page.getByLabel("20-second MunchPal product tour")).toBeVisible();
  const copy = await page.locator("main").innerText();
  expect(copy).not.toMatch(/99[.,]16|0[.,]084|96[.,]01|12 seconds|excellent across/);
  expect(copy).not.toMatch(/thesis|skripsi|15 interviewees|reported evaluation figures lack/i);
  await expect(page.getByRole("heading", { name: "What testing showed", exact: true })).toBeVisible();
  await page.getByText("Test details", { exact: true }).click();
  const results = page.locator('dl[aria-labelledby="munchpal-results-caption"]');
  await expect(results.getByRole("definition").first()).toContainText("59 of 60");
  await expect(results.getByRole("definition").last()).toContainText("50 of 50");
  expect(copy).toContain("109 of 110 task attempts");
  await expect(page.locator('img[src*="munchpal-research.webp"]')).toHaveCount(0);
  await expect(page).toHaveTitle("Munchpal | Alan Sahlan");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/work\/munchpal\/opengraph-image\.jpg/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
});

test("English revision screens load and task details work with the keyboard", async ({ page, context }) => {
  await page.goto("/work/munchpal");
  const revisions = page.getByRole("region", { name: "What I changed, and why" });
  await expect(revisions.getByRole("img")).toHaveCount(4);
  for (const image of await revisions.getByRole("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth === 388 && i.naturalHeight === 834)).toBe(true);
  }
  const revisedChat = revisions.getByRole("link", { name: "Enlarge revised volunteer chat", exact: true });
  await revisedChat.focus();
  await expect(revisedChat).toHaveCSS("outline-style", "solid");
  const [imageTab] = await Promise.all([context.waitForEvent("page"), page.keyboard.press("Enter")]);
  await imageTab.waitForLoadState();
  await expect(imageTab).toHaveURL(/\/images\/figma\/munchpal\/message-after\.svg$/);
  await imageTab.close();
  const disclosure = page.getByText("Test details", { exact: true });
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Resident tasks", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Volunteer tasks", exact: true })).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Resident tasks", exact: true })).toHaveCount(0);
});

test("Munchpal is one local gallery destination", async ({ page }) => {
  await page.goto("/#work");
  const row = page.locator('.project-row[data-project="munchpal"]');
  const link = row.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "/work/munchpal");
  await link.click();
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
});

test("keyboard and pointer traversal keep one gallery preview active", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const rows = page.locator(".project-row");
  await rows.first().getByRole("link", { includeHidden: true }).focus();
  for (const slug of ["aurelia", "paylecta", "pawfriend", "munchpal"]) {
    const row = page.locator(`.project-row[data-project="${slug}"]`);
    await expect(row.getByRole("link", { includeHidden: true })).toBeFocused();
    await expect(row.getByRole("link", { includeHidden: true })).toHaveAttribute("href", `/work/${slug}`);
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    if (slug !== "munchpal") await page.keyboard.press("Tab");
  }
  const munchpal = rows.nth(3);
  await rows.first().getByRole("heading").hover();
  await expect(munchpal.getByRole("link", { includeHidden: true })).toBeFocused();
  await expect(munchpal).toHaveAttribute("data-expanded", "true");
  await page.locator("#work").focus();
  await page.mouse.move(0, 0);
  for (const index of [0, 3, 1, 3, 2, 3]) {
    await rows.nth(index).getByRole("heading").hover();
    await expect(rows.nth(index)).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  }
  await expect.poll(() => munchpal.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test("shared Munchpal entry and native new-tab visit preserve their destinations", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(e => e.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.locator("img").last().hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "action-image");
  await project.locator("img").last().click();
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => {
    const effect = a.effect as KeyframeEffect | null;
    return effect?.pseudoElement?.includes("view-transition-group(munchpal-image)") && a.playState === "running";
  })), { intervals: [10, 10, 20] }).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.goto("/#work");
  const [tab] = await Promise.all([context.waitForEvent("page"), project.click({ modifiers: ["Control"] })]);
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/work\/munchpal$/);
  await expect(page).toHaveURL(/\/#work$/);
  await tab.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(tab.locator("#work")).toBeFocused();
  await tab.close();
});

test("gallery Back, Forward, and return preserve Munchpal selection and position", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  const heading = project.getByRole("heading", { name: "Munchpal", exact: true });
  await heading.click({ trial: true });
  await project.evaluate(link => link.addEventListener("click", () => {
    sessionStorage.setItem("munchpal-test-departure-y", String(scrollY));
  }, { capture: true, once: true }));
  await heading.click();
  const y = Number(await page.evaluate(() => sessionStorage.getItem("munchpal-test-departure-y")));
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.goBack();
  await expect(project).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(page.locator("#work")).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThanOrEqual(1);
});
