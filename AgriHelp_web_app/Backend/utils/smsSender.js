import twilio from "twilio";
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, body) => {
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
};