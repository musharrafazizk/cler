import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
  budget: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(payload: Partial<ContactPayload>) {
  const requiredFields: Array<keyof ContactPayload> = [
    "name",
    "email",
    "whatsapp",
    "service",
    "message",
    "budget",
  ];

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      return `${field} is required`;
    }
  }

  if (!emailRegex.test(payload.email!)) {
    return "Invalid email address";
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function inquiryTemplate(payload: ContactPayload) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f6f4ef;padding:24px;color:#171717;">
      <div style="max-width:640px;margin:auto;background:#fff;border:1px solid #e4dfd8;border-radius:12px;overflow:hidden;">
        <div style="padding:18px 22px;background:#121214;color:#fff;">
          <h1 style="margin:0;font-size:20px;letter-spacing:.04em;">XCLER — New Project Inquiry</h1>
        </div>
        <div style="padding:20px 22px;line-height:1.6;">
          <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>WhatsApp:</strong> ${escapeHtml(payload.whatsapp)}</p>
          <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
          <p><strong>Budget:</strong> ${escapeHtml(payload.budget)}</p>
          <p><strong>Project Description:</strong></p>
          <p style="white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
        </div>
      </div>
    </div>
  `;
}

function confirmationTemplate(payload: ContactPayload) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f6f4ef;padding:24px;color:#171717;">
      <div style="max-width:640px;margin:auto;background:#fff;border:1px solid #e4dfd8;border-radius:12px;overflow:hidden;">
        <div style="padding:18px 22px;background:#121214;color:#fff;">
          <h1 style="margin:0;font-size:20px;letter-spacing:.04em;">Thanks for contacting XCLER</h1>
        </div>
        <div style="padding:20px 22px;line-height:1.6;">
          <p>Hi ${escapeHtml(payload.name)},</p>
          <p>
            We received your project inquiry and will be in touch on WhatsApp within 24 hours.
          </p>
          <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
          <p><strong>Budget:</strong> ${escapeHtml(payload.budget)}</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>;
    const validationError = validate(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = payload as ContactPayload;

    await resend.emails.send({
      from: "Xcler Website <onboarding@resend.dev>",
      to: "hello@xcler.dev",
      subject: `New project inquiry from ${data.name} — Xcler`,
      replyTo: data.email,
      html: inquiryTemplate(data),
    });

    await resend.emails.send({
      from: "Xcler Website <onboarding@resend.dev>",
      to: data.email,
      subject: "We received your inquiry — Xcler",
      html: confirmationTemplate(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" }, { status: 500 });
  }
}
