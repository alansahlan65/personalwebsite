# Contact

Reviewed 19 October 2026. [The Contact route](../app/contact/page.tsx) and [form](../app/contact/contact-form.tsx) prepare email drafts to `alansahlanwork@gmail.com`.

## Delivery and recovery

Prepare an email leads to Open email draft. Name, email, and message are required; topic is optional. The encoded `mailto:` opens the visitor's email app, where they send the message. The website sends no email itself. Native form validation and mailto behavior remain without JavaScript.

Copy email uses the verified address. Copy message assembles the current subject/message, requiring message text but no name/email validation. Pending clipboard writes disable their controls. Editing invalidates a pending response so stale completion cannot replace the new draft's feedback.

Clipboard denial/unavailability reveals labelled read-only text, focuses/selects it for manual copying, and preserves the editable draft. Prepared drafts retain a direct retry link. Optional session storage keeps the draft within the current tab when permitted; storage failures leave the form usable.

## Layout and access

Visible labels, inline error descriptions, stable status feedback, cobalt focus, and theme-aware surfaces support the form. Fields and the submit have 54px minimum height; copy actions are 48px. Use shared 16px fields and pill actions. Contact columns stack below 950px and name/email below 600px. The compact footer avoids repeating the invitation.

Resume and professional destinations remain native links. Local checks inspect draft/href behavior without sending mail or claiming inbox delivery. See [quality checks](quality.md).
