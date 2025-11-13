import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"2minreview" <${config.smtp.user}>`,
      to: email,
      subject: 'Your OTP for 2minreview',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to 2minreview!</h2>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">© 2025 2minreview. All rights reserved.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"2minreview" <${config.smtp.user}>`,
      to: email,
      subject: 'Welcome to 2minreview!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">We're excited to have you on India's most trusted career transformation platform.</p>
          <p style="font-size: 14px; color: #666;">Get started by:</p>
          <ul style="font-size: 14px; color: #666;">
            <li>Completing your profile</li>
            <li>Reading authentic reviews</li>
            <li>Joining relevant circles</li>
            <li>Exploring AI-powered career guidance</li>
          </ul>
          <a href="${config.frontend.url}/dashboard" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Go to Dashboard</a>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">© 2025 2minreview. All rights reserved.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
