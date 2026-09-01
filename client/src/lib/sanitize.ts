/* Paper Garden style: rich text is kept typographically quiet and safe before it reaches a paper notice surface. */
import DOMPurify from "dompurify";

export function sanitizePostHtml(value: string) {
  return DOMPurify.sanitize(value, { USE_PROFILES: { html: true }, ADD_ATTR: ["target", "rel"] });
}
