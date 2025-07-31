import nodemailer from "nodemailer";

export default async function sendMail(name: string, email: string,phone:string, message: string, feedback: object):Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: "Alert Negative Feedback detected!!",
      html: `
        <h2>from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>phone:</strong><br/>${phone}</p>
        <p><strong>phone:</strong><br/>${message}</p>
        ${"The Feedback Details are as follows:\n"+Object.keys(feedback).map(key => `<p><strong>${key}:</strong> ${feedback[key]}</p>`).join("\n")}
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}
