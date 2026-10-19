import { expect, test } from "@playwright/test";

type TourWindow = typeof window & { OPENER: {
  ready: boolean;
  DURATION: number;
  seekFrame: (time: number) => Promise<void>;
  tl: { time: () => number; paused: () => boolean; play: () => void };
} };

test.use({ viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce" });
test.setTimeout(120_000);

for (const slug of ["munchpal", "paylecta"]) {
  test(`${slug} editable tour renders the same frame after reverse seeking`, async ({ page }) => {
    await page.goto(`/demos/${slug}/index.html?clean=1`);
    await page.waitForFunction(() => (window as TourWindow).OPENER?.ready);
    const frames: Buffer[] = [];
    for (const time of [5, 10, 5]) {
      await page.evaluate(async time => {
        await (window as TourWindow).OPENER.seekFrame(time);
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      }, time);
      frames.push(await page.locator("#stage").screenshot());
    }
    expect(frames[0].equals(frames[2])).toBe(true);
    expect(frames[0].equals(frames[1])).toBe(false);
  });

  test(`${slug} seeking to the end preserves a paused frame`, async ({ page }) => {
    await page.goto(`/demos/${slug}/index.html?debug=1`);
    await page.waitForFunction(() => (window as TourWindow).OPENER?.ready);
    const state = await page.evaluate(async () => {
      const tour = (window as TourWindow).OPENER;
      await tour.seekFrame(tour.DURATION);
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      return { time: tour.tl.time(), duration: tour.DURATION, paused: tour.tl.paused() };
    });
    expect(state.paused).toBe(true);
    expect(state.time).toBe(state.duration);
  });

  test(`${slug} ordinary playback still loops after the final frame`, async ({ page }) => {
    await page.goto(`/demos/${slug}/index.html?debug=1`);
    await page.waitForFunction(() => (window as TourWindow).OPENER?.ready);
    await page.evaluate(async () => {
      const tour = (window as TourWindow).OPENER;
      await tour.seekFrame(tour.DURATION - .05);
      tour.tl.play();
    });
    await page.waitForFunction(() => {
      const tour = (window as TourWindow).OPENER;
      return tour.tl.time() < 1 && !tour.tl.paused();
    });
  });
}
