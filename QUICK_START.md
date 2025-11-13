# Quick Start Guide - Get Your API Keys

## 🚀 Minimum Setup to Run the App

You need just **2 API keys** to get started:

### 1. OpenAI API Key (for AI Chat) 🤖

**Get it here:** https://platform.openai.com/api-keys

**Steps:**
1. Sign up or log in to OpenAI
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

**Cost:** Free $5 credits, then ~$0.002 per AI query

### 2. Gmail SMTP (for Email OTP) 📧

**Steps:**
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to "App passwords" (bottom of page)
4. Select "Mail" and generate password
5. Copy the 16-digit password
6. Add to `backend/.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```

## ✅ Your Environment Files

I've created:
- ✅ `backend/.env` - Ready to configure
- ✅ `frontend/.env` - Already configured
- ✅ `SETUP_GUIDE.md` - Detailed instructions

## 🎯 Next Steps

### Step 1: Add Your API Keys

Edit `backend/.env`:
```bash
cd /home/user/app/backend
nano .env  # or use any text editor
```

Add your:
- OpenAI API key
- Gmail email and app password

### Step 2: Start the Application

**Option A: Docker (Easiest)**
```bash
cd /home/user/app
docker-compose up -d
docker exec -it 2minreview-backend npm run prisma:migrate
```

**Option B: Local Development**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run prisma:migrate
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Step 3: Test the App

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register with your email
4. Check your email for OTP
5. Verify and log in
6. Try the AI chat!

## 🆘 Common Issues

### "Database connection failed"
```bash
# Make sure PostgreSQL is running
docker-compose up -d postgres

# Or install locally:
# Mac: brew install postgresql
# Ubuntu: sudo apt install postgresql
```

### "Email not sending"
- Check SMTP_USER and SMTP_PASS are correct
- Make sure you used App Password (not regular password)
- Check spam folder

### "AI not responding"
- Verify your OpenAI API key
- Check you have credits: https://platform.openai.com/usage

## 📚 Full Documentation

See `SETUP_GUIDE.md` for:
- All API keys (optional ones)
- Twilio SMS setup
- AWS S3 setup
- Production configuration
- Security best practices

## 🎉 You're Ready!

Once you add those 2 keys, you'll have a fully functional EdTech platform with:
- ✅ User authentication
- ✅ Email OTP verification
- ✅ AI career assistant
- ✅ Review system
- ✅ User dashboard

Happy coding! 🚀
