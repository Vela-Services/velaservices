import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, issues, message } = await request.json();

    // Compose the email content
    const issueList =
      Array.isArray(issues) && issues.length > 0
        ? issues.map((issue: string) => `- ${issue}`).join("\n")
        : "None specified";

    const mailContent = `
New contact form submission from Véla:

Name: ${name}
Email: ${email}

Possible Issue(s):
${issueList}

Message:
${message}
`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Véla Contact" <${process.env.SMTP_USER}>`,
      to: `${process.env.SMTP_USER}`,
      subject: "New Contact Form Submission",
      text: mailContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
