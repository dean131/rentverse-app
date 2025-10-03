// Create a new file at: core-service/src/services/email.service.ts

import nodemailer from "nodemailer";
import { config } from "../config/index.js";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
    });
  }

  async sendMail({ to, subject, html }: MailOptions): Promise<void> {
    const mailOptions = {
      from: `Rentverse <${config.email.from}>`,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully to:", to);
    } catch (error) {
      console.error("Error sending email:", error);
      // In a real-world app, you might want to throw a more specific error here
      throw new Error("Could not send email.");
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
