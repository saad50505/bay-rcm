import { NextResponse } from "next/server";
import { Resend } from "resend";

// Contact / demo-request submissions are delivered with Resend (https://resend.com).
// All secrets live on the server only — see .env.example for the required vars:
//   RESEND_API_KEY, CONTACT_FORM_FROM_EMAIL, CONTACT_FORM_TO_EMAILS
const resend = new Resend(process.env.RESEND_API_KEY);

type DemoPayload = {
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  practice?: string;
  providers?: string;
  specialty?: string;
  ehr?: string;
  slot?: string;
  note?: string;
  audit?: boolean;
  pageUrl?: string;
  // Honeypot: real users never fill this; bots usually do.
  company?: string;
};

// ── Basic in-memory rate limit ──────────────────────────────────────────────
// Simple per-IP sliding window. Good enough as a first line of defense; for a
// multi-instance/serverless deployment back this with Redis/Upstash instead.
const RATE_LIMIT_MAX = 5; // submissions ...
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes per IP
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone is optional; when present accept digits with common separators (7+ digits).
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clamp = (value: string, max: number) => value.slice(0, max);

export async function POST(request: Request) {
  // 1) Rate limit before doing any work.
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // 2) Parse body.
  let data: DemoPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 3) Honeypot: if the hidden field is filled, silently accept (don't tip off
  //    the bot) but send nothing.
  if (data.company && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fname = clamp(data.fname?.trim() ?? "", 100);
  const lname = clamp(data.lname?.trim() ?? "", 100);
  const email = clamp(data.email?.trim() ?? "", 200);
  const phone = clamp(data.phone?.trim() ?? "", 40);
  const practice = clamp(data.practice?.trim() ?? "", 200);
  const specialty = clamp(data.specialty?.trim() ?? "", 100);
  const slot = clamp(data.slot?.trim() ?? "", 100);
  const note = clamp(data.note?.trim() ?? "", 5000);

  // 4) Validation (mirrors the client so the endpoint can't be bypassed).
  if (!fname || !email || !practice || !specialty || !slot) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  // 5) Ensure the service is configured.
  const from = process.env.CONTACT_FORM_FROM_EMAIL;
  const recipients = (process.env.CONTACT_FORM_TO_EMAILS ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  if (!process.env.RESEND_API_KEY || !from || recipients.length === 0) {
    console.error(
      "Email service not configured: set RESEND_API_KEY, CONTACT_FORM_FROM_EMAIL and CONTACT_FORM_TO_EMAILS."
    );
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  // 6) Build the message.
  const fullName = `${fname}${lname ? " " + lname : ""}`;
  const submittedAt = new Date();
  const submittedAtPT = submittedAt.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "full",
    timeStyle: "short",
  });
  const pageUrl = (() => {
    const fromBody = data.pageUrl?.trim();
    if (fromBody && /^https?:\/\//i.test(fromBody)) return clamp(fromBody, 500);
    return request.headers.get("referer") || "—";
  })();

  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Practice", practice],
    ["Providers", clamp(data.providers?.trim() || "—", 100)],
    ["Specialty", specialty],
    ["EHR system", clamp(data.ehr?.trim() || "—", 100)],
    ["Preferred time slot", slot],
    ["Claims audit requested", data.audit ? "Yes" : "No"],
    ["Message", note || "—"],
    ["Submitted", `${submittedAtPT} (PT)`],
  ];

  const text = [
    "New contact form submission — Bay RCM",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0B1628;max-width:600px;margin:0 auto">
      <div style="background:#0B1628;padding:20px 24px;border-radius:10px 10px 0 0">
        <h2 style="margin:0;color:#FAFAF8;font-size:18px;font-weight:600">New contact form submission</h2>
        <p style="margin:4px 0 0;color:#C8973A;font-size:13px">Bay RCM website</p>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #e5e5e5;border-top:none">
        ${rows
          .map(
            ([label, value], i) =>
              `<tr style="background:${i % 2 ? "#ffffff" : "#f7f7f5"}">
                 <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;white-space:nowrap;vertical-align:top;width:170px">${escapeHtml(
                   label
                 )}</td>
                 <td style="padding:10px 14px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(
                   value
                 )}</td>
               </tr>`
          )
          .join("")}
      </table>
      <p style="font-size:12px;color:#8B95A8;margin:12px 2px 0">Reply directly to this email to respond to ${escapeHtml(
        fullName
      )}.</p>
    </div>`;

  // 7) Send. `from` is your verified domain; `replyTo` is the visitor so a reply
  //    goes straight to them — the visitor address is never used as the sender.
  const { error } = await resend.emails.send({
    from,
    to: recipients,
    replyTo: email,
    subject: `New contact form submission — ${fullName}`,
    text,
    html,
  });

  if (error) {
    console.error("Resend failed to send contact submission:", error);
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
