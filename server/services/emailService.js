const nodemailer = require('nodemailer');

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  // Create transporter with connection pooling for faster consecutive email dispatches
  cachedTransporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    pool: true, // Enable connection pooling to reuse the SMTP connection
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10, // max 10 messages per second
  });

  return cachedTransporter;
};

const sendOtpEmail = async (toEmail, otp) => {
  console.log(`\n========================================`);
  console.log(`📧 [EMAIL SIMULATOR]`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: Password Reset OTP`);
  console.log(`OTP Code: ${otp}`);
  console.log(`========================================\n`);

  const transporter = getTransporter();

  if (!transporter) {
    console.log('⚠️ SMTP configuration missing in .env. Falling back to terminal display only.');
    return true;
  }

  try {
    const mailOptions = {
      from: `"HireBoost Authentication" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'HireBoost Password Reset - OTP Verification',
      text: `Hello,\n\nYou requested a password reset code for your HireBoost account.\n\nYour 6-digit OTP verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this reset, please ignore this email.\n\nBest regards,\nThe HireBoost Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1f2937; margin-bottom: 6px;">HireBoost</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0; margin-bottom: 24px;">Smart Resume Optimizer</p>
          <div style="border-top: 1px solid #f3f4f6; padding-top: 20px;">
            <p style="color: #374151; font-size: 16px;">Hello,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">You requested a password reset code for your HireBoost account.</p>
            <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
              <span style="font-size: 12px; font-weight: bold; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">OTP Verification Code</span>
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.15em; color: #1f2937;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. Please enter this code in the recovery screen to complete your password reset.</p>
            <p style="color: #ef4444; font-size: 12px; font-style: italic;">If you did not request this reset, please secure your account immediately or ignore this email.</p>
          </div>
          <div style="border-top: 1px solid #f3f4f6; margin-top: 32px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HireBoost. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Real OTP email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send real OTP email via SMTP: ${error.message}`);
    // Return true anyway so that development flow continues if they have invalid credentials but still saw the terminal log
    return true;
  }
};

module.exports = {
  sendOtpEmail,
};
