/**
 * SECURITY_AUDIT.md Finding 004: donor-controlled fields (twitter, linkedin,
 * discord, email) were interpolated directly into admin notification email
 * HTML with no escaping, allowing HTML/script injection that could execute
 * in HTML-rendering email clients. Escape every user-supplied value before
 * it is placed inside an HTML template.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
