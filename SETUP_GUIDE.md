# Environment Variables Setup Guide

This guide will help you configure all the necessary API keys and credentials for the 2minreview platform.

## Backend Environment Variables

The backend requires several API keys and credentials. Here's how to get each one:

### 1. Database Configuration ✅

**Already configured** for local development:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/2minreview?schema=public"
```

For Docker, the connection string is already set up in `docker-compose.yml`.

### 2. JWT Secret ✅

**Already configured** with a secure random secret. For production, generate a strong secret:
```bash
# Generate a secure secret
openssl rand -base64 32
```

### 3. OpenAI API Key 🔑 (REQUIRED for AI Assistant)

**How to get it:**

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Update in `backend/.env`:
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Pricing:**
- Free tier: $5 credits (expires after 3 months)
- Pay-as-you-go: ~$0.002 per request for GPT-3.5 Turbo

### 4. Email SMTP Configuration 📧 (REQUIRED for OTP)

**Option A: Gmail (Recommended for development)**

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-digit password
6. Update in `backend/.env`:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-digit-app-password
   ```

**Option B: SendGrid (Recommended for production)**

1. Sign up at [SendGrid](https://sendgrid.com)
2. Get your API key
3. Update in `backend/.env`:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

**Option C: Other SMTP Providers**
- Mailgun: https://mailgun.com
- AWS SES: https://aws.amazon.com/ses/
- Postmark: https://postmarkapp.com

### 5. Twilio SMS Configuration 📱 (OPTIONAL)

Only needed if you want phone number verification via SMS.

**How to get it:**

1. Sign up at [Twilio](https://www.twilio.com)
2. Get $15 free trial credits
3. Go to Console → Account Info
4. Copy your Account SID and Auth Token
5. Get a Twilio phone number (free with trial)
6. Update in `backend/.env`:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### 6. AWS S3 Configuration ☁️ (OPTIONAL)

Only needed for file uploads (profile pictures, documents).

**How to get it:**

1. Sign up for [AWS](https://aws.amazon.com)
2. Create an IAM user with S3 access
3. Generate access keys
4. Create an S3 bucket
5. Update in `backend/.env`:
   ```bash
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=your-bucket-name
   ```

## Quick Start Configurations

### Minimum Setup (Development)

To run the app locally, you **only need**:

1. ✅ **Database** (already configured)
2. ✅ **JWT Secret** (already configured)
3. 🔑 **OpenAI API Key** (for AI chat - required)
4. 📧 **SMTP Email** (for OTP - required)

The app will work without Twilio SMS and AWS S3.

### Docker Setup

If using Docker Compose:

1. Make sure `backend/.env` has:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/2minreview?schema=public"
   ```

2. All other settings remain the same

## Environment Files Checklist

- [x] `backend/.env` - Created and configured
- [x] `frontend/.env` - Created and configured
- [ ] Add your OpenAI API key
- [ ] Add your SMTP email credentials
- [ ] (Optional) Add Twilio credentials
- [ ] (Optional) Add AWS S3 credentials

## Testing Your Configuration

### Test Database Connection

```bash
cd backend
npm run prisma:generate
npx prisma db push
```

### Test Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✓ Database connected
✓ Server running on port 5000
```

### Test Email (after adding SMTP credentials)

Register a new user - you should receive an OTP email.

### Test AI Chat (after adding OpenAI key)

Log in and go to `/ai-chat` - try sending a message.

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to git (already in `.gitignore`)
- Use different secrets for production
- Rotate API keys regularly
- Enable 2FA on all service accounts
- Use environment variables in production (not `.env` files)

## Getting Help

If you encounter issues:

1. **Database connection errors**: Check PostgreSQL is running
2. **Email not sending**: Verify SMTP credentials and "Less secure app access" settings
3. **AI not responding**: Check OpenAI API key and account credits
4. **CORS errors**: Verify `FRONTEND_URL` in backend `.env`

## Next Steps

Once environment variables are configured:

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Register a new account
5. Test all features

---

**Need help?** Check the main README.md for detailed setup instructions.
