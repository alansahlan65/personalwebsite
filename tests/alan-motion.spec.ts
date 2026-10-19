import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";

const character = (page: Page) => page.getByRole("button", { name: "Say hello to Alan" });

async function pixels(page: Page) {
  const image = await character(page).screenshot({ animations: "allow" });
  return sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function freezeBlend(page: Page) {
  await character(page).evaluate(element => {
    for (const animation of element.getAnimations({ subtree: true })) {
      if (animation.effect instanceof KeyframeEffect && animation.effect.getKeyframes().some(frame => "opacity" in frame)) {
        animation.pause();
        // The existing ease-out is at approximately half opacity here.
        animation.currentTime = Number(animation.effect!.getTiming().duration) * 0.12;
      }
    }
  });
}

function countFlashes(before: Awaited<ReturnType<typeof pixels>>, after: Awaited<ReturnType<typeof pixels>>, middle: Awaited<ReturnType<typeof pixels>>, region: [number, number, number, number]) {
  const { width, height } = before.info;
  let flashes = 0;
  for (let y = Math.floor(height * region[1]); y < height * region[3]; y++) {
    for (let x = Math.floor(width * region[0]); x < width * region[2]; x++) {
      const i = (y * width + x) * 3;
      // Common dark, opaque material. Ignore silhouettes and changing facial details.
      if (before.data[i] < 110 && after.data[i] < 110 && Math.abs(before.data[i] - after.data[i]) < 15) {
        if (middle.data[i] > Math.max(before.data[i], after.data[i]) + 24) flashes++;
      }
    }
  }
  return flashes;
}

function detachedFragments(image: Awaited<ReturnType<typeof pixels>>) {
  const { width, height } = image.info;
  const background = [...image.data.subarray(0, 3)];
  const visited = new Uint8Array(width * height);
  const areas: number[] = [];
  // Exclude the greeting bubble and ground. Keep the entire upper silhouette,
  // including pale skin, so detached sleeve/trouser fragments remain distinct.
  const top = Math.floor(height * .13);
  const bottom = Math.floor(height * .75);
  function foreground(index: number) {
    // Include the pale, fading hand. A high threshold incorrectly separates
    // its darker thumb shadow from the still-connected translucent palm.
    return background.some((channel, offset) => Math.abs(image.data[index * 3 + offset] - channel) > 12);
  }
  for (let y = top; y < bottom; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x;
      if (visited[start] || !foreground(start)) continue;
      const queue = [start];
      visited[start] = 1;
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const index = queue[cursor];
        const px = index % width;
        const py = Math.floor(index / width);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = px + dx;
            const ny = py + dy;
            const neighbor = ny * width + nx;
            if (nx < 0 || nx >= width || ny < top || ny >= bottom || visited[neighbor] || !foreground(neighbor)) continue;
            visited[neighbor] = 1;
            queue.push(neighbor);
          }
        }
      }
      // Ignore single-pixel antialiasing specks at the source silhouette.
      if (queue.length > 8) areas.push(queue.length);
    }
  }
  return areas.sort((a, b) => b - a).slice(1);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(character(page)).toHaveAttribute("data-head-ready", "true");
  await expect(character(page)).toHaveAttribute("data-greeting-head-ready", "true");
});

test("hover and exit keep sleeve and trouser pixels attached to Alan", async ({ page }) => {
  await page.addStyleTag({ content: ".site-cursor,.site-cursor-arrow{display:none!important}" });
  await page.waitForTimeout(800);
  const box = (await character(page).boundingBox())!;
  for (const time of [30, 60, 120, 240]) {
    await character(page).evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    await page.mouse.move(box.x + box.width * .8, box.y + box.height * .55);
    await expect(character(page)).toHaveAttribute("data-greeting", "true");
    await character(page).evaluate((element, time) => element.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = time;
    }), time);
    expect(detachedFragments(await pixels(page)), `floating material at hover ${time}ms`).toEqual([]);
  }
  await character(page).evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await page.mouse.move(0, 0);
  await expect(character(page)).toHaveAttribute("data-greeting", "false");
  await character(page).evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => {
    animation.pause();
    animation.currentTime = 60;
  }));
  expect(detachedFragments(await pixels(page)), "floating material at exit 60ms").toEqual([]);
});

test("the arm fade and shoulder rotation use the same clock", async ({ page }) => {
  const box = (await character(page).boundingBox())!;
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .55);
  await expect(character(page)).toHaveAttribute("data-greeting", "true");
  const durations = await character(page).evaluate(element => {
    const arm = element.querySelector<HTMLElement>('[data-character-part="wave-arm"]')!;
    return arm.getAnimations().map(animation => Number(animation.effect!.getTiming().duration));
  });
  expect(durations.length).toBe(2);
  expect(durations[0]).toBe(durations[1]);
  await character(page).evaluate((element, duration) => element.getAnimations({ subtree: true }).forEach(animation => {
    animation.pause();
    animation.currentTime = duration * .12;
  }), durations[0]);
  const opacity = Number(await character(page).locator('[data-character-part="wave-arm"]').evaluate(arm => getComputedStyle(arm).opacity));
  expect(opacity).toBeGreaterThan(.3);
  expect(opacity).toBeLessThan(.7);
});

test("head facing blend keeps the hair opaque instead of flashing the page through it", async ({ page }) => {
  const box = (await character(page).boundingBox())!;
  const before = await pixels(page);
  await page.mouse.move(box.x - 30, box.y + box.height * .26);
  await expect(character(page).locator('[data-head-view="left"]')).toHaveAttribute("data-active", "true");
  await page.waitForTimeout(200);
  const after = await pixels(page);
  await page.mouse.move(-1, -1);
  await page.waitForTimeout(200);
  await page.mouse.move(box.x - 30, box.y + box.height * .26);
  await freezeBlend(page);
  const middle = await pixels(page);
  const flashes = countFlashes(before, after, middle, [.43, .13, .57, .19]);
  expect(flashes, "head transition exposes the light page through common opaque hair").toBe(0);
});

test("hover blend keeps the shirt opaque instead of flashing the page through it", async ({ page }) => {
  const box = (await character(page).boundingBox())!;
  const before = await pixels(page);
  await page.mouse.move(box.x + box.width * .9, box.y + box.height * .6);
  await page.waitForTimeout(600);
  const after = await pixels(page);
  await page.mouse.move(box.x + box.width + 30, box.y + box.height * .6);
  await page.waitForTimeout(600);
  await page.mouse.move(box.x + box.width * .9, box.y + box.height * .6);
  await freezeBlend(page);
  const middle = await pixels(page);
  const flashes = countFlashes(before, after, middle, [.45, .45, .57, .56]);
  expect(flashes, "hover transition exposes the light page through the opaque shirt").toBe(0);
});

test("rapid direction changes and hover reversals retain full head coverage every frame", async ({ page }) => {
  const box = (await character(page).boundingBox())!;
  const center = { x: box.x + box.width * .5, y: box.y + box.height * .26 };
  await character(page).evaluate(element => {
    const samples: number[][] = [];
    Object.assign(window, { alanCoverageSamples: samples, alanCoverageRunning: true });
    function compose(values: { opacity: number; additive: boolean }[]) {
      return values.reduce((coverage, { opacity, additive }) => additive ? Math.min(1, coverage + opacity) : opacity + coverage * (1 - opacity), 0);
    }
    function sample() {
      const views = [...element.querySelectorAll<HTMLElement>("[data-head-view]")];
      const coverage = compose(views.map(view => ({
        additive: getComputedStyle(view).mixBlendMode === "plus-lighter",
        opacity: Number(getComputedStyle(view).opacity) * compose([...view.querySelectorAll("img")].map(image => ({
          additive: getComputedStyle(image).mixBlendMode === "plus-lighter",
          opacity: Number(getComputedStyle(image).opacity),
        }))),
      })));
      const body = compose([...element.querySelectorAll<HTMLElement>('[data-character-part="rest-body"], [data-character-part="greeting-body"]')].map(layer => ({ opacity: Number(getComputedStyle(layer).opacity), additive: getComputedStyle(layer).mixBlendMode === "plus-lighter" })));
      const arms = compose([...element.querySelectorAll<HTMLElement>('[data-character-part="rest-arm"], [data-character-part="wave-arm"]')].map(layer => ({ opacity: Number(getComputedStyle(layer).opacity), additive: getComputedStyle(layer).mixBlendMode === "plus-lighter" })));
      samples.push([coverage, body, arms]);
      if (Reflect.get(window, "alanCoverageRunning")) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  for (let index = 0; index < 24; index++) {
    const angle = (index * 135) * Math.PI / 180;
    const radius = index % 3 === 0 ? 300 : 110;
    await page.mouse.move(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
    await page.waitForTimeout(30);
  }
  const coverage = await page.evaluate(() => {
    Reflect.set(window, "alanCoverageRunning", false);
    return Reflect.get(window, "alanCoverageSamples") as number[][];
  });
  expect(coverage.length).toBeGreaterThan(24);
  for (const [index, part] of ["head", "body", "arms"].entries()) {
    expect(Math.min(...coverage.map(frame => frame[index])), `${part} becomes transparent when several fades are interrupted`).toBeGreaterThanOrEqual(.99);
  }
});

test("changing motion preference mid-blend settles the artwork immediately", async ({ page }) => {
  const box = (await character(page).boundingBox())!;
  await page.mouse.move(box.x + box.width * .7, box.y + box.height * .5);
  await freezeBlend(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(character(page).locator('[data-head-view="front"] [data-head-expression="greeting"]')).toHaveCSS("opacity", "1");
  await expect(character(page).locator('[data-character-part="greeting-body"]')).toHaveCSS("opacity", "1");
  const fades = await character(page).evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState !== "finished" && animation.effect instanceof KeyframeEffect && animation.effect.getKeyframes().some(frame => "opacity" in frame)).length);
  expect(fades).toBe(0);
});

test("a browser without additive blending uses solid poses without transparent fades", async ({ page }) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = (property: string, value?: string) => property === "mix-blend-mode" && value === "plus-lighter" ? false : value === undefined ? supports(property) : supports(property, value);
  });
  await page.reload();
  await expect(character(page)).toHaveAttribute("data-greeting-head-ready", "true");
  await character(page).hover();
  await expect(character(page).locator('[data-head-view][data-active="true"] [data-head-expression="greeting"]')).toHaveCSS("opacity", "1");
  await expect(character(page).locator('[data-character-part="greeting-body"]')).toHaveCSS("opacity", "1");
  const fades = await character(page).evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.effect instanceof KeyframeEffect && animation.effect.getKeyframes().some(frame => "opacity" in frame) && !(animation instanceof CSSTransition)).length);
  expect(fades).toBe(0);
});
