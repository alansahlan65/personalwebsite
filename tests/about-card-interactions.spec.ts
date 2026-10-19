import { expect, test } from "@playwright/test";

for (const area of ["copy", "padding", "button"] as const) {
  test(`trivia swipes from ${area} without accidentally revealing an answer`, async ({ page }) => {
    await page.goto("/about");
    const card = page.locator("[data-front]");
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    const target = area === "copy" ? await card.locator("p").first().boundingBox() : area === "button" ? await card.getByRole("button").boundingBox() : null;
    const x = target ? target.x + target.width / 2 : box!.x + box!.width - 35;
    const y = target ? target.y + target.height / 2 : box!.y + box!.height - 25;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 120, y, { steps: 12 });
    await page.mouse.up();
    await expect(card.getByRole("heading")).toHaveText("My kind of game night?");
    await expect(card.getByRole("button", { name: "Reveal answer" })).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => card.evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41))).toBeLessThan(1);
    await card.getByRole("button", { name: "Reveal answer" }).click();
    await expect(card.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
  });
}

test("card dragging still works after keyboard navigation", async ({ page }) => {
  await page.goto("/about");
  const next = page.getByRole("button", { name: "Next question" });
  await next.focus();
  await page.keyboard.press("Enter");
  const card = page.locator("[data-front]");
  const box = await card.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 - 120, box!.y + box!.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(card.getByRole("heading")).toHaveText("What keeps me turning pages?");
});

test("comparison paints press feedback only in Motion and restores on cancellation", async ({ page }) => {
  await page.goto("/about");
  const demo = page.locator("[data-experiment]");
  const save = demo.getByRole("button", { name: /^(Save a favorite|Saved)$/ });
  const paint = save.locator("[data-control-visual]");
  await save.scrollIntoViewIfNeeded();
  const box = await save.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await expect.poll(() => paint.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11)).toBeLessThan(.98);
  await save.dispatchEvent("pointercancel", { isPrimary: true, pointerType: "mouse" });
  await expect.poll(() => paint.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11)).toBe(1);
  await page.mouse.up();
  await demo.getByRole("button", { name: "Static", exact: true }).click();
  await expect(demo).toHaveAttribute("data-motion", "off");
  await expect(paint).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await demo.getByRole("button", { name: "Motion", exact: true }).click();
  await expect(demo).toHaveAttribute("data-motion", "off");
  await expect(demo).toContainText("Motion is off to match your device settings.");
});

test("About survives RTL and expanded text spacing", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/about");
  await page.evaluate(() => document.documentElement.dir = "rtl");
  await page.addStyleTag({ content: "main { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; } main p { line-height: 1.5; margin-block-end: 2em; }" });
  await page.getByRole("button", { name: "Save a favorite" }).click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

for (const width of [1440, 390]) for (const [name, dx, dy] of [
  ["top left", -35, -65], ["top right", 35, -65], ["bottom left", -35, 65], ["bottom right", 35, 65],
] as const) {
  test(`trivia moves ${name} without clipping at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/about");
    const card = page.locator("[data-front]");
    await expect(card).toHaveAttribute("data-draggable");
    await card.evaluate(node => node.scrollIntoView({ block: "center" }));
    const box = await card.boundingBox();
    const x = box!.x + box!.width / 2, y = box!.y + box!.height / 2;
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 12 });
    await expect.poll(() => card.evaluate(node => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return { x: Math.sign(matrix.m41), y: Math.sign(matrix.m42) };
    })).toEqual({ x: Math.sign(dx), y: Math.sign(dy) });
    const lifted = await card.boundingBox();
    expect(lifted!.x).toBeGreaterThan(15);
    expect(lifted!.x + lifted!.width).toBeLessThan(width - 15);
    expect(lifted!.y).toBeGreaterThan(76);
    expect(lifted!.y + lifted!.height).toBeLessThan(990);
    expect(await card.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return node.contains(document.elementFromPoint(rect.left + 5, rect.top + rect.height / 2));
    })).toBe(true);
    await page.mouse.up();
    await expect(card.getByRole("heading")).toHaveText("Marvel or DC?");
    await expect.poll(() => card.evaluate(node => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.abs(matrix.m41) + Math.abs(matrix.m42);
    })).toBeLessThan(1);
  });
}

test("a card stays visible outside its deck and Escape returns it without changing questions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/about");
  const card = page.locator("[data-front]");
  await expect(card).toHaveAttribute("data-draggable");
  await card.evaluate(node => node.scrollIntoView({ block: "center" }));
  const box = await card.boundingBox();
  const x = box!.x + box!.width / 2, y = box!.y + box!.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 230, y - 80, { steps: 15 });
  expect(await card.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const deck = node.parentElement!.getBoundingClientRect();
    return rect.left < deck.left - 150 && node.contains(document.elementFromPoint(rect.left + 5, rect.top + rect.height / 2));
  })).toBe(true);
  await page.keyboard.press("Escape"); await page.mouse.up();
  await expect(card.getByRole("heading")).toHaveText("Marvel or DC?");
  await expect.poll(() => card.evaluate(node => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
    return Math.abs(matrix.m41) + Math.abs(matrix.m42);
  })).toBeLessThan(1);
});

test("the distilled comparison and discovered stories stay clear on repeat", async ({ page }) => {
  await page.goto("/about");
  const demo = page.locator("[data-experiment]");
  await expect(demo.locator("p")).toHaveCount(0);
  await expect(demo).not.toContainText("Select again to undo");
  await expect(demo).not.toContainText("Press the button");
  const notebook = page.locator("[data-notebook]");
  await expect(notebook.getByRole("img")).toHaveAttribute("aria-label", "0 of 3 stories discovered");
  for (const answer of ["Both. I love Marvel and DC.", "The Witcher 3 and Red Dead Redemption 2.", "History. I love reading it, too."]) {
    await notebook.getByRole("button", { name: "Reveal answer", exact: true }).click();
    await expect(notebook.locator("[data-front]")).toContainText(answer);
    await notebook.getByRole("button", { name: "Next question", exact: true }).click();
  }
  await expect(notebook.getByRole("img")).toHaveAttribute("aria-label", "3 of 3 stories discovered");
  await notebook.getByRole("button", { name: "Hide answer", exact: true }).click();
  await expect(notebook.getByRole("img")).toHaveAttribute("aria-label", "3 of 3 stories discovered");
});
