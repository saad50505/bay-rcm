import { NextResponse } from "next/server";

// Where demo requests are delivered.
const TO_EMAIL = "saad.techling@gmail.com";

// Web3Forms is a free email-sending service (no SMTP, no card). Get a free
// access key at https://web3forms.com by entering the destination email above,
// then put it in .env.local as WEB3FORMS_ACCESS_KEY. The key determines which
// inbox receives submissions, so register it with saad.techling@gmail.com.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
};

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let data: DemoPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fname = data.fname?.trim() ?? "";
  const lname = data.lname?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const practice = data.practice?.trim() ?? "";
  const specialty = data.specialty?.trim() ?? "";
  const slot = data.slot?.trim() ?? "";

  // Mirror the client-side validation so the endpoint can't be bypassed.
  if (!fname || !email || !practice || !specialty || !slot) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  const fullName = `${fname}${lname ? " " + lname : ""}`;
  const message = [
    `New demo request from the Bay RCM site`,
    ``,
    `Name:        ${fullName}`,
    `Work email:  ${email}`,
    `Phone:       ${data.phone?.trim() || "—"}`,
    `Practice:    ${practice}`,
    `Providers:   ${data.providers?.trim() || "—"}`,
    `Specialty:   ${specialty}`,
    `EHR system:  ${data.ehr?.trim() || "—"}`,
    `Time slot:   ${slot}`,
    `Claims audit requested: ${data.audit ? "Yes" : "No"}`,
    ``,
    `Notes:`,
    data.note?.trim() || "—",
  ].join("\n");

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New demo request — ${fullName} (${practice})`,
      from_name: "Bay RCM Demo Form",
      to: TO_EMAIL,
      replyto: email,
      // Individual fields (Web3Forms renders these in the email) ...
      name: fullName,
      email,
      phone: data.phone?.trim() || "",
      practice,
      providers: data.providers?.trim() || "",
      specialty,
      ehr: data.ehr?.trim() || "",
      time_slot: slot,
      claims_audit: data.audit ? "Yes" : "No",
      notes: data.note?.trim() || "",
      // ... plus a plain-text summary for convenience.
      message,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to send the demo request. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
