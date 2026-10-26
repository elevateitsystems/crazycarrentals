import { contactInfo } from "@/lib/contact";

export const CONTACT_EMAIL = contactInfo.find((c) => c.label === "Email")?.value ?? "";

/** No enquiry endpoint exists in the API, so forms hand the message to the visitor's own email app. */
export function openMail(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
