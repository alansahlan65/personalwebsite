import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  await page.goto("http://127.0.0.1:3000/work/munchpal#munchpal-media-flow");
  await page.locator(".site-header .theme-toggle").waitFor({ state: "visible" });
  await page.waitForFunction(() => !document.querySelector(".site-header .theme-toggle").disabled);
  await page.evaluate(() => document.fonts.ready);
  const result = await page.locator("#munchpal-media-flow fieldset").evaluate(async fieldset => {
    const capture = () => {
      const style = getComputedStyle(fieldset, "::before");
      return { transform: style.transform, duration: style.transitionDuration, ease: style.transitionTimingFunction,
        direction: getComputedStyle(fieldset).direction, rtl: fieldset.matches(":dir(rtl)"), keyboard: fieldset.matches(":has(input:focus-visible)"),
        checked: Array.from(fieldset.querySelectorAll("input")).map(input => ({ value: input.value, checked: input.checked })), connected: fieldset.isConnected,
        active: document.activeElement?.outerHTML.slice(0, 180),
        animations: fieldset.getAnimations().map(animation => ({ type: animation.constructor.name, target: animation.effect?.target?.constructor.name, pseudo: animation.effect?.pseudoElement, timing: animation.effect?.getTiming(), keys: animation.effect?.getKeyframes() })) };
    };
    const before = capture();
    fieldset.querySelector('input[value="volunteers"]').click();
    getComputedStyle(fieldset, "::before").getPropertyValue("transform");
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const after = capture();
    document.documentElement.dir = "rtl";
    const rtl = capture();
    const rules = [];
    function inspectRules(list) {
      for (const rule of list) {
        if (rule.selectorText?.includes("input[value=\"volunteers\"]") && rule.style?.transform) rules.push({ selector: rule.selectorText, transform: rule.style.transform });
        if (rule.cssRules) inspectRules(rule.cssRules);
      }
    }
    for (const sheet of document.styleSheets) { try { inspectRules(sheet.cssRules); } catch {} }
    return { before, after, rtl, rules };
  });
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
