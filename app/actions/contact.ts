"use server";

import { Resend } from "resend";
import { personalInfo } from "@/lib/data";

const resend = new Resend(process.env.RESEND_API_KEY);

// Escape user input before interpolating it into the HTML email body.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: ContactFieldErrors;
} | null;

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  // Validation — collect per-field errors so the form can show them inline
  const errors: ContactFieldErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length === 0) {
    errors.name = "name is required";
  }

  if (email.length === 0) {
    errors.email = "email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "enter a valid email address, e.g. you@example.com";
  }

  if (message.length === 0) {
    errors.message = "message is required";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Error: fix the highlighted fields and resubmit",
      errors,
    };
  }

  try {
    const { error } = await resend.emails.send({
      from: "Contact Form <contact@elijahwilt.com>",
      // gmail inbox + the addresses tracked in lib/data.ts, so editing data.ts
      // keeps delivery in sync.
      to: ["elijahwilt@gmail.com", personalInfo.email2, personalInfo.email],
      replyTo: email,
      subject: `Contact from ${name} via elijahwilt.com`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <h3>Message:</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message: `Error: message failed to send — try again or email ${personalInfo.email} directly`,
      };
    }

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: `Error: something went wrong — try again or email ${personalInfo.email} directly`,
    };
  }
}
