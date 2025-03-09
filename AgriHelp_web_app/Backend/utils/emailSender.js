import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASSWORD);
console.log(process.env.EMAIL_HOST);
console.log(process.env.EMAIL_PORT);
console.log(process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST ,
  port: process.env.EMAIL_PORT ,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASSWORD ,
  },
  tls: {
    servername: 'smtp.gmail.com',
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false,
  },
});


// Verify the SMTP configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export const sendEmailOTP = async (email, otp) => {
  try {
    console.log(`📧 Email would send to ${email} with OTP: ${otp}`);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your AgriHelp Login OTP",
      text: `Your verification code is: ${otp}\nThis code expires in 5 minutes.`,
      html: `<b>${otp}</b> is your AgriHelp verification code. Valid for 5 minutes.`
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};