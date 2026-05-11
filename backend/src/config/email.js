import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
    });
    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export default resend;
