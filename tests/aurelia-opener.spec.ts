import { expect, test, type Page } from "@playwright/test";

const title = "36-second Aurelia product tour";
declare global {
  interface Window {
    __tour: { time: number; duration: number; playing: boolean; ready: boolean; seek: (time: number) => void };
  }
}
const tour = (page: Page) => page.frameLocator(`iframe[title="${title}"]`);
const status = (page: Page) => tour(page).locator("body").evaluate(() => {
  const api = window.__tour;
  return { time: api.time, duration: api.duration, playing: api.playing };
});

test("Aurelia composition supports pause, replay and persistent manual pause", async ({ page }) => {
  await page.goto("/work/aurelia");
  const frame = page.getByTitle(title);
  await page.getByRole("figure", { name: "Aurelia product tour" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Pause Aurelia product tour" })).toBeVisible();
  expect((await status(page)).duration).toBe(36);
  await page.getByRole("button", { name: "Pause Aurelia product tour" }).click();
  await expect.poll(async () => (await status(page)).playing).toBe(false);
  const pausedAt = (await status(page)).time;
  await page.locator("#aurelia-media").scrollIntoViewIfNeeded();
  await frame.scrollIntoViewIfNeeded();
  expect((await status(page)).time).toBeCloseTo(pausedAt, 1);
  await page.getByRole("button", { name: "Replay Aurelia product tour" }).click();
  await expect.poll(async () => { const s = await status(page); return s.playing && s.time < 2; }).toBe(true);
});

test("Aurelia reduced motion keeps a poster until deliberate playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/aurelia");
  await expect(page.getByTitle(title)).toHaveCount(0);
  await expect(page.getByAltText("Aurelia. Come for Bali. Stay for the house.")).toBeVisible();
  await page.getByRole("button", { name: "Play Aurelia product tour", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause Aurelia product tour" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByTitle(title)).toHaveAttribute("data-present", "false");
  await expect.poll(async () => (await status(page)).playing).toBe(false);
});

test("Aurelia mobile retains the poster and composition link without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/aurelia");
  await expect(page.getByAltText("Aurelia. Come for Bali. Stay for the house.")).toHaveAttribute("src", "/images/figma/aurelia/hero.preview.svg");
  await expect(page.getByRole("link", { name: "Open the Aurelia motion composition" })).toHaveAttribute("href", "/demos/aurelia/index.html");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test("Aurelia preserves keyboard gallery entry and return with the browser header", async ({ page }) => {
  await page.goto("/");
  const project = page.locator('[data-project="aurelia"]').getByRole("link");
  await project.scrollIntoViewIfNeeded(); await project.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await expect(page.getByRole("figure", { name: "Aurelia product tour" })).toBeVisible();
  await page.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
});

test("Aurelia carries both photographs through the handoff and uses a compositor camera", async ({ page }) => {
  await page.goto("/demos/aurelia/index.html?clean=1");
  await expect.poll(() => page.evaluate(() => window.__tour?.ready)).toBe(true);
  await page.evaluate(() => window.__tour.seek(6.2));
  await expect(page.locator("#hero-plane")).toBeVisible();
  await expect(page.locator("#collection-plane")).toBeVisible();
  await expect(page.locator("#hero-plane .hero")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const inFlight = await page.locator('#collection-plane [data-card="1"]').boundingBox();
  await page.evaluate(() => window.__tour.seek(6.84));
  await expect(page.locator("#hero-plane")).toBeHidden();
  const settled = await page.locator('#collection-plane [data-card="1"]').boundingBox();
  expect(inFlight!.x).toBeGreaterThan(settled!.x + 10);
  await page.evaluate(() => window.__tour.seek(18.2));
  await expect(page.locator("#world")).toHaveCSS("zoom", "1");
  const camera = await page.locator("#world").evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a);
  expect(camera).toBeCloseTo(2, 1);
  for (const selector of [".booking-context__summary", ".booking-drawer__close", ".booking-step__icon"]) {
    await expect(page.locator(selector).first()).toHaveCSS("backdrop-filter", "none");
  }
  await page.evaluate(() => window.__tour.seek(5.5));
  await expect(page.locator("#hero-plane .hero__content")).toHaveCSS("opacity", "1");
});

test("Aurelia failed composition keeps the poster and offers its source link", async ({ page }) => {
  await page.route("**/demos/aurelia/index.html?embed=1", route => route.abort());
  await page.goto("/work/aurelia");
  await page.getByRole("figure", { name: "Aurelia product tour" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("status")).toContainText("The motion composition could not load.", { timeout: 20000 });
  await expect(page.getByRole("link", { name: "Open the motion composition" })).toHaveAttribute("href", "/demos/aurelia/index.html");
  await expect(page.getByAltText("Aurelia. Come for Bali. Stay for the house.")).toBeVisible();
});

test("Aurelia forced colors holds the poster and allows deliberate playback", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/work/aurelia");
  await expect(page.getByTitle(title)).toHaveCount(0);
  await expect(page.getByAltText("Aurelia. Come for Bali. Stay for the house.")).toBeVisible();
  await page.getByRole("button", { name: "Play Aurelia product tour", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause Aurelia product tour" })).toBeVisible();
});

test("Aurelia keeps manual playback without viewport observation", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true }); });
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/work/aurelia");
  await page.getByRole("button", { name: "Play Aurelia product tour", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause Aurelia product tour" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("direct and backward seeks preserve Tirta, Ubud, two adults and the departure edit", async ({ page }) => {
  await page.goto("/demos/aurelia/index.html?clean=1");
  await page.waitForFunction(() => window.__tour?.ready);
  for (const [time, departure, step] of [[29.7, "2027-03-14", "1"], [23.5, "2027-03-12", "2"], [17.6, "", "1"], [29.7, "2027-03-14", "1"]] as const) {
    await page.evaluate(t => window.__tour.seek(t), time);
    await expect(page.locator('#planner-plane [name="checkOut"]')).toHaveValue(departure);
    await expect(page.locator(".booking-form")).toHaveAttribute("data-step", step);
    await expect(page.locator('#planner-plane [name="property"]')).toHaveValue("tirta-forest-villa");
    await expect(page.locator('#planner-plane [name="area"]')).toHaveValue("Ubud");
    await expect(page.locator('#planner-plane [name="adults"]')).toHaveValue("2");
  }
  await page.evaluate(() => window.__tour.seek(0));
  await expect(page.locator('#planner-plane [name="checkIn"]')).toHaveValue("");
  await expect(page.locator('#planner-plane [name="checkOut"]')).toHaveValue("");
});
