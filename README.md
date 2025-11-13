# 2minreview - Career Transformation Platform

**Version:** 1.0.0
**Built for:** India's EdTech Market

## Overview

2minreview is India's most trusted career transformation platform combining authentic reviews, AI-powered guidance, and community-driven support. This full-stack application features advanced biometric authentication, ML-powered fraud detection, and integrated career journey management.

## Features

### Core Features (MVP)
- ✅ **Advanced Authentication System**
  - Email/Phone OTP verification
  - JWT-based secure sessions
  - Multi-level verification system (LEVEL_1 to LEVEL_4)

- ✅ **Review System**
  - Authentic, verified reviews for colleges, courses, and companies
  - ML-powered authenticity scoring
  - Upvote/downvote mechanism
  - Credibility-based ranking

- ✅ **AI-Powered Career Assistant**
  - OpenAI GPT-powered text chat
  - Context-aware career guidance
  - Free tier: 50 queries/month
  - Premium: Unlimited queries

- ✅ **User Dashboard**
  - Subscription tier management
  - Credibility score tracking
  - Verification status overview
  - Quick actions for common tasks

- ✅ **Community Features** (Schema Ready)
  - Professional circles
  - Public, verified, and premium circle types
  - Discussion posts and comments

## Technology Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **SMS:** Twilio
- **AI:** OpenAI API (GPT-3.5 Turbo)

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (for frontend)
- **Database:** PostgreSQL in Docker

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Auth, error handling, rate limiting
│   │   ├── routes/                # API routes
│   │   ├── services/              # External services (email, SMS, AI)
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   └── index.ts               # Server entry point
│   ├── .env.example               # Environment variables template
│   ├── Dockerfile                 # Backend Docker config
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── contexts/              # React contexts (Auth)
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   ├── App.tsx                # Main app component
│   │   ├── index.css              # Global styles
│   │   └── main.tsx               # Entry point
│   ├── .env.example               # Frontend environment variables
│   ├── Dockerfile                 # Frontend Docker config
│   ├── nginx.conf                 # Nginx configuration
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── docker-compose.yml             # Docker Compose configuration
├── PRD_Readme.md                  # Product Requirements Document
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+ (or use Docker)
- OpenAI API key (for AI features)
- SMTP credentials (for email OTP)
- Twilio credentials (optional, for SMS OTP)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd app
```

2. **Set up environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Frontend
cp frontend/.env.example frontend/.env
# Edit if needed (defaults to http://localhost:5000/api)
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker exec -it 2minreview-backend npm run prisma:migrate
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Set up database**
Make sure PostgreSQL is running, then:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. **Start development server**
```bash
npm run dev
```

Backend will run on http://localhost:5000

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit if backend is not on localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/2minreview?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+911234567890",
  "role": "STUDENT"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/verify-otp
Verify email OTP
```json
{
  "userId": "user-id",
  "otp": "123456"
}
```

#### GET /api/auth/profile
Get user profile (requires authentication)

### Review Endpoints

#### POST /api/reviews
Create a new review (requires authentication)
```json
{
  "reviewType": "COLLEGE",
  "collegeId": "college-id",
  "rating": 4,
  "title": "Great experience",
  "content": "Detailed review...",
  "pros": "Good infrastructure",
  "cons": "Limited placement support",
  "tags": ["engineering", "computer-science"]
}
```

#### GET /api/reviews
Get all reviews (with pagination and filters)
```
?reviewType=COLLEGE&page=1&limit=10&sortBy=createdAt
```

#### GET /api/reviews/:id
Get single review by ID

#### POST /api/reviews/:id/upvote
Upvote a review (requires authentication)

#### POST /api/reviews/:id/downvote
Downvote a review (requires authentication)

### AI Assistant Endpoints

#### POST /api/ai/chat
Chat with AI assistant (requires authentication)
```json
{
  "message": "What are the top engineering colleges in India?",
  "conversationId": "optional-conversation-id"
}
```

#### GET /api/ai/conversations
Get conversation history (requires authentication)

## Database Schema

The application uses a comprehensive Prisma schema with the following main models:

- **User** - User accounts with verification levels
- **UserProfile** - Extended user profile information
- **VerificationDocument** - Documents for identity verification
- **OTP** - One-time passwords for email/phone verification
- **College** - College/institution information
- **Course** - Course details
- **Review** - User reviews with ratings
- **Comment** - Comments on reviews and posts
- **Circle** - Community circles
- **CircleMember** - Circle membership
- **Post** - Circle posts
- **AIConversation** - AI chat history
- **MentorProfile** - Mentor information
- **SubscriptionHistory** - Payment and subscription records

See `backend/prisma/schema.prisma` for complete schema details.

## Available Scripts

### Backend

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio
```

### Frontend

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Docker

```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose ps              # List running services
```

## Features Roadmap

### Phase 1: MVP (Current)
- ✅ Authentication system
- ✅ Review management
- ✅ AI chat assistant
- ✅ User dashboard
- ✅ Database schema

### Phase 2: Enhanced Features
- ⏳ Face verification system
- ⏳ Advanced ML fraud detection
- ⏳ Community circles (UI implementation)
- ⏳ Advanced search and filtering
- ⏳ Content recommendation engine

### Phase 3: Growth Features
- ⏳ Voice AI assistant (Hindi + English)
- ⏳ Mobile apps (React Native)
- ⏳ Mentorship matching
- ⏳ Training programs
- ⏳ Job board integration

### Phase 4: Scale
- ⏳ Multi-language support
- ⏳ Payment integration
- ⏳ Analytics dashboard
- ⏳ Admin panel
- ⏳ API rate limiting with Redis

## Security Considerations

- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Environment variable security
- SQL injection prevention via Prisma ORM
- XSS protection

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination for large data sets
- API response caching (planned with Redis)
- Lazy loading for frontend components
- Image optimization (planned with CDN)
- Database connection pooling

## Contributing

This is a proprietary project. For contributions or inquiries, contact the development team.

## License

© 2025 2minreview. All Rights Reserved.

## Support

For issues or questions:
- Email: support@2minreview.com
- Developer: Sameer Swain (sameer@2minreview.com)

## Acknowledgments

Built with:
- React & TypeScript
- Node.js & Express
- PostgreSQL & Prisma
- OpenAI API
- Tailwind CSS
- Docker & Nginx

---

**Building India's Most Trusted Career Transformation Platform**

*"Ekta Hi Bal Hai" - Unity is Strength*
