# Seed Data Documentation

This document describes the seed data included in the 2minreview database for development and testing.

## Overview

The seed script populates your database with realistic data representing India's EdTech ecosystem, including:
- **3 Demo Users** with different roles and subscription tiers
- **10 Top Colleges** (IITs, NITs, Private Universities, IIMs, AIIMS)
- **6 Courses** (both offline and online)
- **8 Authentic Reviews** with ratings and comments
- **3 Comments** on reviews

## Running the Seed Script

### Method 1: Using npm script (Recommended)

```bash
cd backend
npm run seed
```

### Method 2: Using Prisma directly

```bash
cd backend
npx prisma db seed
```

### Method 3: After migrations

The seed script automatically runs after `prisma migrate dev`:

```bash
npm run prisma:migrate
```

## Demo User Accounts

All demo users have the same password for easy testing:

### 1. Student Account
- **Email:** `student@demo.com`
- **Password:** `password123`
- **Role:** Student
- **Subscription:** Free
- **Verification:** Level 2 (Email + Phone verified)
- **Credibility Score:** 85
- **Profile:** Final year CS student at IIT Delhi

### 2. Professional Account
- **Email:** `professional@demo.com`
- **Password:** `password123`
- **Role:** Professional
- **Subscription:** Professional Premium
- **Verification:** Level 3 (Email + Phone + Face verified)
- **Credibility Score:** 150
- **Profile:** Software Engineer at Google with 5 years experience

### 3. Entrepreneur Account
- **Email:** `entrepreneur@demo.com`
- **Password:** `password123`
- **Role:** Entrepreneur
- **Subscription:** Enterprise Premium
- **Verification:** Level 4 (Highest - Trusted user)
- **Credibility Score:** 200
- **Profile:** Founder & CEO of EdTech startup

## Seeded Colleges

### IITs (Indian Institutes of Technology)
1. **IIT Delhi** - Rank 1
   - Location: New Delhi
   - Type: Engineering
   - Established: 1961

2. **IIT Bombay** - Rank 2
   - Location: Mumbai, Maharashtra
   - Type: Engineering
   - Established: 1958

3. **IIT Madras** - Rank 3
   - Location: Chennai, Tamil Nadu
   - Type: Engineering
   - Established: 1959

### NITs (National Institutes of Technology)
4. **NIT Trichy** - Rank 10
   - Location: Tiruchirappalli, Tamil Nadu
   - Type: Engineering
   - Established: 1964

5. **NIT Karnataka (NITK)** - Rank 13
   - Location: Surathkal, Mangalore
   - Type: Engineering
   - Established: 1960

### Private Universities
6. **BITS Pilani** - Rank 25
   - Location: Pilani, Rajasthan
   - Type: Engineering
   - Established: 1964

7. **VIT Vellore** - Rank 30
   - Location: Vellore, Tamil Nadu
   - Type: Engineering
   - Established: 1984

### Management Institutes
8. **IIM Ahmedabad** - Rank 1
   - Location: Ahmedabad, Gujarat
   - Type: Management
   - Established: 1961

9. **IIM Bangalore** - Rank 2
   - Location: Bangalore, Karnataka
   - Type: Management
   - Established: 1973

### Medical Colleges
10. **AIIMS Delhi** - Rank 1
    - Location: New Delhi
    - Type: Medical
    - Established: 1956

## Seeded Courses

### College Courses
1. **B.Tech in Computer Science** - IIT Delhi
   - Duration: 4 years
   - Fees: ₹8-10 lakhs total

2. **M.Tech in Artificial Intelligence** - IIT Delhi
   - Duration: 2 years
   - Fees: ₹4-5 lakhs total

3. **MBA (PGPM)** - IIM Ahmedabad
   - Duration: 2 years
   - Fees: ₹25-30 lakhs total

### Online Courses
4. **Full Stack Web Development Bootcamp** - Coursera
   - Duration: 6 months
   - Fees: ₹60,000
   - Rating: 4.7/5
   - Enrollments: 50,000+

5. **Data Science Specialization** - Udacity
   - Duration: 8 months
   - Fees: ₹50,000
   - Rating: 4.6/5
   - Enrollments: 35,000+

6. **Digital Marketing Masterclass** - upGrad
   - Duration: 4 months
   - Fees: ₹25,000
   - Rating: 4.5/5
   - Enrollments: 20,000+

## Seeded Reviews

### College Reviews
1. **IIT Delhi** - 5 stars
   - "Best Engineering College in India"
   - Author: Student account
   - 145 upvotes, Verified

2. **IIT Delhi** - 4 stars
   - "Great Institution with Room for Improvement"
   - Author: Professional account (Alumni)
   - 89 upvotes, Verified

3. **IIT Bombay** - 5 stars
   - "Dream College for Engineers"
   - Author: Student account
   - 203 upvotes, Verified

4. **BITS Pilani** - 4 stars
   - "Excellent Private Engineering College"
   - Author: Professional account
   - 67 upvotes, Verified

5. **VIT Vellore** - 4 stars
   - "Good College for Those Who Missed IIT/NIT"
   - Author: Student account
   - 134 upvotes, Verified

6. **IIM Ahmedabad** - 5 stars
   - "Best MBA in India - Worth Every Penny"
   - Author: Professional account
   - 312 upvotes, Verified

### Course Reviews
7. **Full Stack Web Development** - 5 stars
   - "Life-Changing Course for Career Switch"
   - Author: Professional account
   - 289 upvotes, Verified

8. **Data Science Specialization** - 4 stars
   - "Solid Foundation in Data Science"
   - Author: Entrepreneur account
   - 156 upvotes, Verified

## Testing the Seeded Data

### 1. Login and Explore
```bash
# Start the backend
cd backend
npm run dev

# Start the frontend
cd frontend
npm run dev
```

Then visit http://localhost:3000 and login with any demo account.

### 2. API Testing

**Get all colleges:**
```bash
curl http://localhost:5000/api/colleges
```

**Get all reviews:**
```bash
curl http://localhost:5000/api/reviews
```

**Login as demo user:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"password123"}'
```

### 3. Browse in Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Opens at http://localhost:5555 - Visual database browser

## Re-seeding the Database

To clear existing data and re-seed:

```bash
cd backend
npm run seed
```

**Warning:** This will delete ALL existing data and recreate the seed data.

## Customizing Seed Data

To modify the seed data:

1. Edit `backend/prisma/seed.ts`
2. Add/remove/modify colleges, courses, or reviews
3. Run `npm run seed` to apply changes

Example - Adding a new college:
```typescript
prisma.college.create({
  data: {
    name: 'Your College Name',
    location: 'City, State',
    state: 'State',
    city: 'City',
    type: 'Engineering',
    ranking: 50,
    // ... other fields
  },
})
```

## Production Considerations

⚠️ **Important:** The seed script is for **development only**.

**Never run seed scripts in production** as they:
- Delete all existing data
- Use weak passwords (password123)
- Are meant for testing only

For production data:
- Import real data through admin panel
- Use strong passwords
- Follow data privacy regulations
- Implement proper data validation

## Troubleshooting

### Issue: "bcryptjs not found"
```bash
cd backend
npm install bcryptjs
```

### Issue: "Database connection failed"
Make sure PostgreSQL is running and DATABASE_URL is correct in `.env`

### Issue: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Issue: "Migration required"
```bash
npm run prisma:migrate
```

## Summary

The seed data provides a comprehensive starting point for:
- ✅ Testing authentication flows
- ✅ Browsing realistic reviews
- ✅ Testing different user roles and permissions
- ✅ Developing new features with real-world data
- ✅ Demonstrating the platform to stakeholders

All seed data reflects the Indian EdTech market with:
- Real college names and details
- Accurate fee structures
- Authentic review content
- Proper verification levels
- Realistic engagement metrics

---

**Happy Testing!** 🎉
