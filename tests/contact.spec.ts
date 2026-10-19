import { expect, test } from "@playwright/test";
import type { AxeResults } from "axe-core";

test("the footer invitation opens Contact with destination focus", async ({ page }) => {
  await page.goto("/");
  const invitation = page.getByRole("link", { name: "Let’s work together.", exact: true });
  await expect(invitation).toHaveAttribute("href", "/contact");
  await invitation.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1, name: "Let’s work together." })).toBeFocused();
  const form = page.getByRole("form", { name: "Prepare an email" });
  await expect(form).toBeVisible();
  await expect(form).toHaveAccessibleDescription("Opens a draft in your email app for you to send.");
  expect(await form.evaluate(element => Boolean(element.querySelector("#contact-delivery-hint")!.compareDocumentPosition(element.querySelector("input")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Let’s work together.", exact: true })).toHaveCount(0);
});

test("empty and malformed fields get associated errors and focus", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Prepare an email" });
  await expect.poll(() => form.evaluate((form: HTMLFormElement) => form.noValidate)).toBe(true);
  const name = page.getByRole("textbox", { name: "Your name", exact: true });
  const email = page.getByRole("textbox", { name: "Email address", exact: true });
  const message = page.getByRole("textbox", { name: "Your message", exact: true });
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription("Enter your name.");
  await expect(email).toHaveAccessibleDescription("Enter your email address.");
  await expect(message).toHaveAccessibleDescription("Enter a message.");
  await name.fill("Sam Recruiter");
  await email.fill("invalid-address");
  await message.fill("I have a Product Designer opportunity to discuss.");
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAccessibleDescription("Use an email address like name@example.com.");
  await email.fill("sam@example.com");
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveValue("I have a Product Designer opportunity to discuss.");
});

test("valid submission prepares an encoded draft and keeps the message", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Your name", exact: true }).fill("Sam & Co");
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("sam+portfolio@example.com");
  await page.getByRole("combobox", { name: "Topic (optional)", exact: true }).selectOption("A project");
  const message = "Hello Alan,\nLet’s discuss design & engineering. 100% interested!";
  await page.getByRole("textbox", { name: "Your message", exact: true }).fill(message);
  // Headless Chromium has no email handler; this only prepares a draft, never sends mail.
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(page.getByRole("status")).toHaveText("Draft ready. Send it from your email app.");
  const href = await page.getByRole("link", { name: "Reopen email draft", exact: true }).getAttribute("href");
  const draft = new URL(href!);
  expect(draft.protocol).toBe("mailto:");
  expect(draft.pathname).toBe("alansahlanwork@gmail.com");
  expect(draft.searchParams.get("subject")).toBe("A project — Sam & Co");
  expect(draft.searchParams.get("body")).toBe(`${message}\n\nFrom: Sam & Co\nEmail: sam+portfolio@example.com`);
  await expect(page.getByRole("textbox", { name: "Your message", exact: true })).toHaveValue(message);
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("textbox", { name: "Your message", exact: true }).fill("A revised message");
  await expect(page.getByRole("status")).toBeEmpty();
  await expect(page.getByRole("link", { name: "Reopen email draft", exact: true })).toHaveCount(0);
});

test("drafts survive navigation and reload without submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Your name", exact: true }).fill("Sam");
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill("sam@example.com");
  await page.getByRole("combobox", { name: "Topic (optional)", exact: true }).selectOption("A role opportunity");
  await page.getByRole("textbox", { name: "Your message", exact: true }).fill("A draft I’m still writing.");
  await page.getByRole("link", { name: "Alan Sahlan, home" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(page.getByRole("textbox", { name: "Your message", exact: true })).toHaveValue("A draft I’m still writing.");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toHaveValue("Sam");
  await expect(page.getByRole("textbox", { name: "Email address", exact: true })).toHaveValue("sam@example.com");
  await expect(page.getByRole("combobox", { name: "Topic (optional)", exact: true })).toHaveValue("A role opportunity");
  await expect(page.getByRole("status")).toBeEmpty();
});

test("native keyboard order and the message shortcut work", async ({ page }) => {
  await page.goto("/contact");
  const name = page.getByRole("textbox", { name: "Your name", exact: true });
  await name.focus();
  for (const control of [page.getByRole("textbox", { name: "Email address", exact: true }), page.getByRole("combobox"), page.getByRole("textbox", { name: "Your message", exact: true }), page.getByRole("button", { name: "Open email draft" })]) {
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();
    expect(await control.evaluate((node) => getComputedStyle(node).outlineWidth)).toBe("2px");
    await expect(control).toBeInViewport();
  }
  await page.getByRole("textbox", { name: "Your message", exact: true }).focus();
  await page.keyboard.press("Control+Enter");
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription("Enter your name.");
});

for (const width of [320, 390, 650, 768, 1000, 1440]) {
  test(`Contact reflows at ${width}px including enlarged text and RTL`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    await page.evaluate(() => document.fonts.ready);
    for (const mode of ["normal", "enlarged", "rtl"]) {
      if (mode === "enlarged") await page.addStyleTag({ content: "html { font-size: 200%; }" });
      if (mode === "rtl") await page.evaluate(() => { document.documentElement.dir = "rtl"; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), mode).toBeLessThanOrEqual(width);
      for (const control of await page.locator("main input, main select, main textarea, main button").all()) {
        const box = await control.boundingBox();
        expect(box!.x, mode).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width, mode).toBeLessThanOrEqual(width);
        expect(box!.height, mode).toBeGreaterThanOrEqual(44);
      }
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
}

test("the form has no automated accessibility violations in empty and error states", async ({ page }) => {
  await page.goto("/contact");
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  for (const state of ["empty", "errors"]) {
    if (state === "errors") await page.getByRole("button", { name: "Open email draft" }).click();
    const violations = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: { run: () => Promise<AxeResults> } }).axe;
      return (await axe.run()).violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map((node) => node.target) }));
    });
    expect(violations, state).toEqual([]);
  }
});

test("forced colors and reduced motion retain form focus and errors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/contact");
  await expect.poll(() => page.getByRole("form", { name: "Prepare an email" }).evaluate((form: HTMLFormElement) => form.noValidate)).toBe(true);
  await page.getByRole("button", { name: "Open email draft" }).click();
  const name = page.getByRole("textbox", { name: "Your name", exact: true });
  await expect(name).toBeFocused();
  await expect(name).toHaveCSS("outline-style", "solid");
  await expect(name).toHaveCSS("border-top-style", "dashed");
  await expect(page.getByRole("button", { name: "Open email draft" })).toHaveCSS("transition-duration", "0s");
});

test("without JavaScript there is a native, validated email draft fallback", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Prepare an email" });
  await expect(form).toHaveAttribute("action", "mailto:alansahlanwork@gmail.com");
  expect(await form.evaluate((form: HTMLFormElement) => form.noValidate)).toBe(false);
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(page.getByRole("textbox", { name: "Your name", exact: true })).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", "/contact");
  await context.close();
});
