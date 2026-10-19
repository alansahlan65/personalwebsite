"use client";
import { ControlVisual } from "../components/control-visual";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "../components/ui-icons";
import { CONTACT_EMAIL } from "../lib/portfolio-links";
import styles from "./contact.module.css";

const DRAFT_KEY = "portfolio-contact-draft";
const fields = ["name", "email", "topic", "message"] as const;
type Field = typeof fields[number];
type Draft = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

function readDraft(form: HTMLFormElement): Draft {
  const data = new FormData(form);
  return Object.fromEntries(fields.map((field) => [field, String(data.get(field) ?? "")])) as Draft;
}

function validate(draft: Draft): Errors {
  const errors: Errors = {};
  if (!draft.name.trim()) errors.name = "Enter your name.";
  if (!draft.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = "Use an email address like name@example.com.";
  if (!draft.message.trim()) errors.message = "Enter a message.";
  return errors;
}

function assembleEmail(draft: Draft) {
  const topic = draft.topic || "Hello Alan";
  const subject = draft.name.trim() ? `${topic} — ${draft.name.trim()}` : topic;
  const signature = [draft.name.trim() && `From: ${draft.name.trim()}`, draft.email.trim() && `Email: ${draft.email.trim()}`].filter(Boolean).join("\n");
  const body = `${draft.message.trim()}${signature ? `\n\n${signature}` : ""}`;
  return { subject, body };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const edited = useRef(false);
  const [errors, setErrors] = useState<Errors>({});
  const [draftHref, setDraftHref] = useState("");
  const [status, setStatus] = useState("");
  const [copyReady, setCopyReady] = useState(false);
  const [copying, setCopying] = useState(false);
  const [manualCopy, setManualCopy] = useState<{ label: string; text: string } | null>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const copyAttempt = useRef(0);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    // Leave native validation available in the server-rendered, no-JavaScript form.
    form.noValidate = true;
    setCopyReady(true);
    if (edited.current) return;
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null");
      if (!saved || typeof saved !== "object") return;
      fields.forEach((field) => {
        const value = (saved as Partial<Draft>)[field];
        const control = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (typeof value === "string" && !control.value) control.value = value;
      });
    } catch {
      // A private browser can deny storage; the form still works in memory.
    }
  }, []);

  useEffect(() => {
    if (!manualCopy) return;
    manualCopyRef.current?.focus();
    manualCopyRef.current?.select();
  }, [manualCopy]);

  function onInput(event: FormEvent<HTMLFormElement>) {
    edited.current = true;
    setDraftHref("");
    setStatus("");
    setManualCopy(null);
    setCopying(false);
    copyAttempt.current++;
    const form = event.currentTarget;
    const draft = readDraft(form);
    const field = (event.target as HTMLInputElement).name as Field;
    if (errors[field]) {
      const error = validate(draft)[field];
      setErrors((current) => ({ ...current, [field]: error }));
    }
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* Storage is optional. */ }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const draft = readDraft(form);
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    const invalid = fields.find((field) => nextErrors[field]);
    if (invalid) {
      requestAnimationFrame(() => (form.elements.namedItem(invalid) as HTMLElement).focus());
      return;
    }
    const { subject, body } = assembleEmail(draft);
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftHref(href);
    setStatus("Draft ready. Send it from your email app.");
    window.location.assign(href);
  }

  async function copy(kind: "email" | "message") {
    const draft = readDraft(formRef.current!);
    if (kind === "message" && !draft.message.trim()) {
      setErrors((current) => ({ ...current, message: "Add a message before copying." }));
      requestAnimationFrame(() => (formRef.current!.elements.namedItem("message") as HTMLElement).focus());
      return;
    }
    const { subject, body } = assembleEmail(draft);
    const text = kind === "email" ? CONTACT_EMAIL : `Subject: ${subject}\n\n${body}`;
    const attempt = ++copyAttempt.current;
    setCopying(true);
    setManualCopy(null);
    setStatus("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (attempt === copyAttempt.current) setStatus(kind === "email" ? "Email address copied." : "Message copied. Paste it into your email app.");
    } catch {
      if (attempt === copyAttempt.current) {
        setStatus("Couldn't copy. Copy the selected text below.");
        setManualCopy({ label: kind === "email" ? "Email address to copy" : "Message to copy", text });
      }
    } finally {
      if (attempt === copyAttempt.current) setCopying(false);
    }
  }

  return (
    <form ref={formRef} className={styles.form} aria-labelledby="contact-form-title" aria-describedby="contact-delivery-hint" action={`mailto:${CONTACT_EMAIL}`} method="post" encType="text/plain" onSubmit={onSubmit} onInput={onInput}>
      <div className={styles.formHeading}>
        <h2 id="contact-form-title">Prepare an email</h2>
      </div>
      <p className={styles.hint} id="contact-delivery-hint">Opens a draft in your email app for you to send.</p>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={100} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "contact-name-error" : undefined} />
          {errors.name && <p className={styles.error} id="contact-name-error">{errors.name}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email address</label>
          <input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} required maxLength={254} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "contact-email-error" : undefined} />
          {errors.email && <p className={styles.error} id="contact-email-error">{errors.email}</p>}
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-topic">Topic <span className={styles.optional}>(optional)</span></label>
        <select id="contact-topic" name="topic" defaultValue="">
          <option value="">Choose a topic</option>
          <option value="A role opportunity">A role opportunity</option>
          <option value="A project">A project</option>
          <option value="Something else">Something else</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Your message</label>
        <textarea id="contact-message" name="message" rows={6} required maxLength={5000} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "contact-message-error" : undefined} onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }} />
        {errors.message && <p className={styles.error} id="contact-message-error">{errors.message}</p>}
      </div>
      <div className={styles.submitGroup}>
        <button className={styles.submit} type="submit" data-magnet="control"><span className={styles.submitMagnet} data-magnet-part><ControlVisual className={styles.submitVisual}><span>Open email draft</span><ArrowIcon /></ControlVisual></span></button>
        <div className={styles.recovery} hidden={!copyReady}>
          <div className={styles.copyActions}>
            <button type="button" disabled={copying} onClick={() => copy("email")} data-pointer-feedback="local"><ControlVisual>Copy email</ControlVisual></button>
            <button type="button" disabled={copying} onClick={() => copy("message")} data-pointer-feedback="local"><ControlVisual>Copy message</ControlVisual></button>
          </div>
        </div>
        <div className={styles.feedback}>
        <p role="status" aria-atomic="true">{status}</p>
        {draftHref && <a href={draftHref} data-pointer-feedback="local">Reopen email draft</a>}
        </div>
        {manualCopy && <div className={`${styles.field} ${styles.manualCopy}`}><label htmlFor="contact-copy-text">{manualCopy.label}</label><textarea ref={manualCopyRef} id="contact-copy-text" readOnly value={manualCopy.text} rows={manualCopy.label === "Email address to copy" ? 2 : 6} /></div>}
      </div>
    </form>
  );
}
