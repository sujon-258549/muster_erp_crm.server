import nodemailer from 'nodemailer';
import config from '../config/index.ts';

export const otpEmailTemplate = (data: { name?: string; otp: number }) => {
  const userName = data.name || 'User';
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .otp-box { background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset OTP</h2>
        <p>Hello ${userName},</p>
        <p>You requested to reset your password. Use the following OTP code:</p>
        <div class="otp-box">
          <div class="otp-code">${data.otp}</div>
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to: string, html: string, subject?: string) => {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
  const result = await transporter.sendMail({
    from: config.email.from,
    to: to,
    subject: subject || 'Place change your Password ✔',
    text: 'Hi there We received a request to reset your password. If you did not make this request, you can safely ignore this email.To reset your password, please click the link below:',
    html: html,
  });
  return result;
};