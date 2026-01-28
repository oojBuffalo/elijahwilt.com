"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Validation
  if (!name || name.trim().length === 0) {
    return { success: false, message: "Error: name is required" };
  }

  if (!email || email.trim().length === 0) {
    return { success: false, message: "Error: email is required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Error: invalid email format" };
  }

  if (!message || message.trim().length === 0) {
    return { success: false, message: "Error: message is required" };
  }

  try {
    const { error } = await resend.emails.send({
      from: "Contact Form <contact@elijahwilt.com>",
      to: ["elijahwilt@gmail.com", "wilt.83@osu.edu", "ew356@cornell.edu"],
      replyTo: email,
      subject: `Contact from ${name} via elijahwilt.com`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Error: failed to send message" };
    }

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Error: something went wrong" };
  }
}
