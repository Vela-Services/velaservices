import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, text } = await req.json();

    // ⚠️ Mets ton vrai compte Gmail ou autre SMTP ici
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // ton email
        pass: process.env.SMTP_PASS, // mot de passe ou App Password
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
