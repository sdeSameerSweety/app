import twilio from 'twilio';
import { config } from '../config/env';

const client = config.twilio.accountSid && config.twilio.authToken
  ? twilio(config.twilio.accountSid, config.twilio.authToken)
  : null;

export const sendOTPSMS = async (phone: string, otp: string): Promise<void> => {
  if (!client) {
    console.warn('Twilio not configured. OTP:', otp);
    return;
  }

  try {
    await client.messages.create({
      body: `Your 2minreview OTP is: ${otp}. Valid for 10 minutes.`,
      from: config.twilio.phoneNumber,
      to: phone,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
};
