# 2minreview - Product Requirements Document (PRD)

## Executive Summary

**Product Name:** 2minreview  
**Version:** 5.0 Market-Validated  
**Last Updated:** November 2025  
**Document Owner:** Sameer Swain  
**Status:** Investment-Ready with Realistic Projections

### 🎯 The Opportunity

2minreview addresses India's $24-29B EdTech and career services market with a platform combining authentic reviews, AI-powered guidance, and community-driven support. While the market is mature and competitive, significant gaps exist in authenticity, integrated journeys, and vernacular access that create defensible positioning opportunities.

### 💰 Financial Projections (Three-Scenario Model)

| Scenario | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | CAGR | LTV:CAC |
|----------|--------|--------|--------|--------|--------|------|---------|
| **CONSERVATIVE** | ₹5.0 Cr | ₹25.0 Cr | ₹80.0 Cr | ₹150.0 Cr | ₹250.0 Cr | 118% | 3:1 |
| **BASE CASE** | ₹6.5 Cr | ₹42.0 Cr | ₹140.0 Cr | ₹275.0 Cr | ₹400.0 Cr | 135% | 4:1 |
| **OPTIMISTIC** | ₹8.0 Cr | ₹60.0 Cr | ₹181.0 Cr | ₹355.0 Cr | ₹500.0 Cr | 152% | 5:1 |

**Current Plan:** BASE CASE (₹400 Cr Year 5)  
**Stretch Goal:** OPTIMISTIC (requires exceptional execution)

---

## 📋 Table of Contents

1. [Product Vision & Mission](#product-vision--mission)
2. [Market Analysis](#market-analysis)
3. [Problem Statement](#problem-statement)
4. [Solution Overview](#solution-overview)
5. [Target Users & Personas](#target-users--personas)
6. [Core Features](#core-features)
7. [Technical Architecture](#technical-architecture)
8. [Business Model](#business-model)
9. [Go-to-Market Strategy](#go-to-market-strategy)
10. [Success Metrics & KPIs](#success-metrics--kpis)
11. [Competitive Analysis](#competitive-analysis)
12. [Risk Analysis](#risk-analysis)
13. [Implementation Roadmap](#implementation-roadmap)
14. [Team & Resources](#team--resources)
15. [Appendix](#appendix)

---

## Product Vision & Mission

### Vision
Build India's most trusted career transformation platform by executing better on universal needs: authenticity, integrated journeys, and vernacular access.

### Mission
Prove that sustainable EdTech businesses serve users, not just investors. Create a platform that democratizes career success through authentic experiences, AI-powered guidance, and community support.

### Core Values
- **Execution Over Novelty:** We execute universal features better than anyone
- **Trust Over Growth:** Build reputation methodically; trust is non-negotiable
- **Profitability Over Valuation:** Positive unit economics from Year 1
- **Outcomes Over Activity:** Focus on verified career transformations
- **Local Over Global:** Built for India - vernacular, affordable, contextual

---

## Market Analysis

### Market Size (Validated Data)

| Market Segment | 2024 Actual | 2030 Target | CAGR | Sources |
|----------------|-------------|-------------|------|---------|
| EdTech (Total) | $7.5B | $24-29B | 22-26% | IBEF, RedSeer |
| Career Services | $2.0B | $6-7B | 20-23% | Industry estimates |
| Professional Training | $1.5B | $4-5B | 18-22% | Validated |
| **Combined TAM** | **$11B** | **$34-41B** | **21-25%** | ✓ Verified |

### Addressable Market Breakdown

| Segment | Population | Digital-Ready | Premium WTP | Realistic TAM |
|---------|------------|---------------|-------------|---------------|
| Students (15-24) | 293M | 180M | 15-20M | 3.5M (2%) |
| Young Professionals (25-34) | 215M | 150M | 25-30M | 4.5M (3%) |
| Mid-Career (35-44) | 180M | 100M | 8-10M | 1.0M (1%) |
| Entrepreneurs | 12M active | 10M | 1-2M | 0.3M (3%) |
| **TOTAL ADDRESSABLE** | **700M** | **440M** | **50-60M** | **9-10M users** |

### Market Growth Drivers
✅ **Confirmed Drivers:**
- 954M internet users (growing 8-10% YoY)
- Government NEP 2020 initiative
- Digital payment adoption (87% growth)
- Skill India mission (400M target by 2025)
- Post-pandemic digital acceptance

---

## Problem Statement

### 1. Career Guidance Gap ✓ VERIFIED
- **93%** students aware of only 7 career options
- **92%** lack career guidance from schools
- **85%** concerned about higher education choices
- **1** career counselor per 1,800 students

### 2. Skills-Jobs Mismatch ✓ EXTENSIVELY VERIFIED
- Engineering employability: **17-25%**
- General employability: **51.25%** (India Skills 2024)
- Engineers lacking knowledge economy skills: **80%**
- Employers finding skill gaps: **72-84%**

### 3. Information Asymmetry ⚠️ DIRECTIONAL
- Fake reviews compromise platform trust
- Marketing vs reality gap in education choices
- **95%+** MOOC non-completion rates
- Lack of outcome transparency

### 4. Graduate Employment (Corrected)
- **10M** graduates annually
- Despite **46.7M** jobs created (FY24)
- Only **45-51%** are job-ready
- Issue is **quality mismatch**, not job shortage

---

## Solution Overview

### Core Components

#### 1. 🔍 Authenticity Verification System
**Our Key Differentiator**

```
Level 1: Authentication Layer
├── Unique user account verification
├── Mobile number OTP verification
├── Email verification with domain validation
├── Face Authorization (biometric authentication)
│   ├── Live face capture with liveness detection
│   ├── Anti-spoofing mechanisms (detect photos/videos)
│   ├── Face matching with submitted IDs
│   └── Periodic re-verification for high-value actions
├── Duplicate account prevention via face matching
└── Multi-factor authentication (MFA) for security

Level 2: Content Creator Verification
├── Students: College enrollment proof (ID cards, admission letters, .ac.in emails)
├── Working Professionals: Employment verification (offer letters, payslips, work emails)
├── Online Course Participants: Course enrollment proof (certificates, payment receipts)
├── Parents: Identity verification (DOB, full name, mobile number)
├── Face-to-Document Matching: Verify user face matches submitted ID documents
└── ML/DL Implementation: Advanced algorithms to detect fake IDs and fraudulent proofs

Level 3: Advanced Fraud Detection
├── Deep Learning models for document authenticity verification
├── Facial recognition algorithms for identity confirmation
├── Machine Learning for pattern recognition in fake submissions
├── Behavioral analysis to detect suspicious activity patterns
├── Cross-reference verification with external databases
└── Real-time fraud scoring and risk assessment

Level 4: Community Moderation
├── Upvote/downvote with reputation weighting
├── Challenge mechanism for disputing claims
├── Graduated credibility scores based on verification level
├── Transparent moderation logs for accountability
└── Face-verified badge for trusted reviewers
```

**Goal:** 99.5%+ authentic reviews with face authorization vs <70% industry average

#### 2. 🤖 AI-Powered Guidance (Hybrid Model)

**Text AI Assistant:**
- Unlimited queries for premium users
- 50 queries/month for free users
- Context-aware career guidance
- Personalized roadmap generation

**Voice AI Assistant:**
- Hindi + English with code-switching
- 5 free conversations/month
- Unlimited for premium users
- Natural conversation flow

**Hybrid Human+AI Approach:**
- AI handles 70% routine queries
- Human experts for complex cases
- Quality assurance through feedback loops
- Cost-effective scalability

#### 3. 👥 Community & Professional Circles

**Circle Types:**
- **Public Circles:** 500-5,000 members, open discovery
- **Verified Circles:** 100-500 members, entry criteria
- **Premium Circles:** 50-200 members, exclusive access

**Features:**
- Real-time discussion threads
- Resource library with ratings
- Events & meetups (online + offline)
- Mentorship matching
- Internal job board with referrals

#### 4. 📚 Content Engine

**Creator Economy Model:**
- 10,000+ active creators by Year 3
- Revenue sharing: 70% creator, 30% platform
- Quality scoring system
- Vernacular content priority

#### 5. 🎓 Training Programs (CSR-Funded)

**Entrepreneurship Training:**
- 30 hours over 10 weeks
- ₹0 cost to students
- CSR-funded model
- 30% conversion to premium

---

## Target Users & Personas

### Primary Persona: The Tier 2 Hindi Student

**Demographics:**
- Age: 19 years
- Location: Tier 2/3 cities
- Education: 12th pass, 78% (State Board)
- Language: Hindi primary, basic English
- Family Income: ₹6 lakh/year household
- Digital: 4-5 hours/day on phone

**Pain Points:**
- Limited career awareness
- English language barrier
- Budget constraints (₹8-12 lakh for 4-year engineering)
- Lack of authentic guidance

**User Journey:**
1. Discovery through organic search
2. Consumes vernacular content
3. Joins college-specific circle
4. Uses AI for guidance
5. Converts to premium for critical decisions

### Secondary Personas

#### Young Professional (25-34)
- Salary: ₹5-12 LPA
- Goal: Career transition/growth
- Budget: ₹8,000/year acceptable
- Need: Skill development + network

#### Entrepreneur/Freelancer
- Revenue: ₹0-50 lakh/year
- Goal: Business growth
- Budget: ₹25,000/year acceptable
- Need: Training + mentorship + network

---

## Core Features

### Feature Matrix

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| **Authentication** | Email/Phone OTP | + Face authorization with liveness |
| **Content Access** | 40% videos, 60% documents | 100% all content |
| **AI Text Chat** | 50 queries/month | Unlimited |
| **AI Voice Assistant** | 5 conversations/month | Unlimited |
| **Reviews & Search** | Full access, basic filters | Priority placement, advanced filters |
| **Verification Badge** | Basic verified | Face-verified trusted badge |
| **Circles** | Join public circles | + Verified + Premium circles |
| **Training Programs** | ✓ Full access (CSR-funded) | ✓ Full access |
| **Mentorship** | Browse mentors | + Request mentorship + Matching |
| **Job Board** | View listings | + Apply directly + Referrals |
| **Analytics** | Basic stats | Detailed insights + Career path analytics |
| **Support** | Community only | + Email support (24h) |

### Unique Value Propositions

1. **Advanced Biometric Authentication:** Face authorization + ML/DL-powered fraud detection + 4-level verification ensuring 99.5%+ authenticity
2. **Integrated Journey:** Research → Learn → Apply → Network → Outcomes (all-in-one)
3. **Vernacular First:** Full Hindi interface, not just translation
4. **Outcome Tracking:** End-to-end career transformation measurement
5. **CSR-Hybrid Model:** Unlock ₹30,000 Cr annual CSR funding for non-dilutive growth

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Mobile Apps (React Native)  │   API    │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Auth Service  │  Content Service  │  AI Service  │  Analytics│
│  Review Service │  Circle Service   │  Payment    │  Training │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  MongoDB  │  Redis  │  Elasticsearch  │  S3   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js for web application
- React Native for mobile apps
- TypeScript for type safety
- Tailwind CSS for styling

**Backend:**
- Node.js with Express
- Python for ML/AI services
- GraphQL API gateway
- Microservices architecture

**Infrastructure:**
- AWS Cloud (primary)
- CloudFlare CDN
- Docker/Kubernetes
- GitHub Actions CI/CD

**AI/ML:**
- OpenAI GPT-4 for text interactions
- Custom voice models for Hindi/regional languages
- **Facial Recognition & Biometric Authentication:**
  - Face detection using MTCNN or RetinaFace
  - FaceNet or ArcFace for face embeddings
  - Liveness detection using 3D depth analysis
  - Anti-spoofing with texture analysis
  - Real-time face matching (< 1 second response)
- **Deep Learning for Document Verification:**
  - CNN models for ID card authenticity detection
  - OCR with NLP for document text extraction
  - Image forensics for detecting manipulated documents
  - Face-to-document matching algorithms
- **Machine Learning for Fraud Detection:**
  - Random Forest for user behavior analysis
  - Anomaly detection using Isolation Forest
  - Neural networks for pattern recognition
  - Real-time fraud scoring algorithms
- TensorFlow & PyTorch for model development
- Scikit-learn for recommendations and analytics
- OpenCV for image processing

---

## Business Model

### Revenue Streams

#### 1. Subscription Revenue (70% of total)

| Tier | Price | Target Users | Year 5 Target |
|------|-------|--------------|---------------|
| Student Premium | ₹3,999/year | College students | 300,000 users |
| Professional Premium | ₹7,999/year | Working professionals | 150,000 users |
| Enterprise Premium | ₹24,999/year | Entrepreneurs/Teams | 50,000 users |

#### 2. Corporate Training (20% of total)
- B2B training programs
- ₹10-50 lakh per corporate
- CSR funding model

#### 3. Placement Services (10% of total)
- Success-based fees
- ₹25,000 per successful placement
- Corporate partnerships

### Unit Economics

**Customer Acquisition Cost (CAC):**
- Organic: ₹500 per user
- Paid: ₹2,000 per user
- Blended: ₹800 per user

**Lifetime Value (LTV):**
- Student: ₹12,000 (3-year retention)
- Professional: ₹24,000 (3-year retention)
- Enterprise: ₹75,000 (3-year retention)
- Blended: ₹20,000

**LTV:CAC Ratio:** 25:1 (Target: 4:1 minimum)

### Pricing Strategy

**Geographic Pricing:**
- Tier 1 cities: Full price
- Tier 2/3 cities: 25% discount
- International: +50% premium

**Conversion Strategy:**
- Free tier demonstrates value
- Strategic paywalls at decision points
- Community pull (FOMO)
- Time-limited offers
- Annual discount (17% off monthly)

---

## Go-to-Market Strategy

### Phase 1: Foundation (Months 1-6)
**Focus:** Product-Market Fit

**Activities:**
- Launch MVP with core features
- Seed 500 verified reviews
- Beta test with 5,000 users
- Achieve first 50 premium subscribers

**Channels:**
- College partnerships (10 colleges)
- Content marketing (SEO focus)
- Community building (WhatsApp groups)

### Phase 2: Growth (Months 7-18)
**Focus:** Scale & Monetization

**Activities:**
- Public launch
- AI Assistant rollout
- Community features activation
- 100,000 registered users target

**Channels:**
- Organic search (60%)
- Social media (20%)
- Referral program (15%)
- Paid acquisition (5%)

### Phase 3: Scale (Months 19-36)
**Focus:** Market Leadership

**Activities:**
- Voice AI launch
- Mobile apps release
- Vernacular expansion
- 1M registered users target

**Channels:**
- Creator network activation
- Corporate partnerships
- Government collaborations
- International pilot

### Marketing Strategy

**Content Marketing:**
- 500+ SEO-optimized articles
- Success story documentation
- Video content library
- Vernacular content priority

**Community Marketing:**
- College ambassadors program
- Professional circle leaders
- Mentor network
- Alumni engagement

**Partnership Marketing:**
- 500 college partnerships
- 100 corporate CSR partners
- Government skill programs
- EdTech ecosystem collaborations

---

## Success Metrics & KPIs

### North Star Metrics

| Metric | Definition | Year 1 | Year 3 | Year 5 |
|--------|------------|--------|--------|--------|
| **Verified Outcomes** | Career transformations tracked | 1,000 | 50,000 | 200,000 |
| **Monthly Active Users** | Users active in 30 days | 50K | 500K | 2M |
| **Premium Conversion** | Free to paid conversion rate | 5% | 10% | 12% |
| **NPS Score** | User satisfaction | 40 | 50 | 60 |

### Operational Metrics

**User Metrics:**
- Daily Active Users (DAU)
- User retention (D1, D7, D30)
- Feature adoption rates
- Session duration

**Content Metrics:**
- Review authenticity rate (>95%)
- Content creation velocity
- Creator retention
- Content engagement rates

**Business Metrics:**
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Monthly Recurring Revenue (MRR)
- Gross margins (>60%)

**Platform Metrics:**
- Circle activity rates
- AI usage patterns
- Conversion funnel metrics
- Support ticket resolution

---

## Competitive Analysis

### Direct Competitors

| Competitor | Users | Strengths | Weaknesses | Our Edge |
|------------|-------|-----------|------------|----------|
| **CollegeDunia** | 10M+ | 200K+ reviews, SEO dominance | Fake review perception, English-only | Face auth + ML/DL verification |
| **Shiksha.com** | 8M+ | 155K+ reviews, ShikshaGPT | Similar issues, fragmented UX | Biometric security + integrated journey |
| **LinkedIn India** | 100M+ | Massive network, professional trust | Not India-focused, expensive | Face verification + hyperlocal |
| **Naukri.com** | 49.5M | Job market leader, employer relationships | Transactional only, no community | Biometric trust + career transformation |
| **Physics Wallah** | 10M+ | 42% margins, founder brand | Test prep focus only | Face-verified reviews + full guidance |

### Competitive Positioning

```
High Authenticity
       │
       │    2minreview
       │    (Target)
       │
Low ───┼─── High
Guidance│    Guidance
       │
       │    CollegeDunia
       │    Shiksha
       │
Low Authenticity
```

### Competitive Moats

**Year 1-2: Data Moat**
- Verification data
- Behavioral data
- Outcome tracking
- ML model training

**Year 2-3: Network Moat**
- 10,000 active creators
- 5,000 verified mentors
- Hyperlocal community density
- Two-sided marketplace

**Year 3-5: Brand Moat**
- "Truth platform" reputation
- 50,000+ verified outcomes
- Media recognition
- Cultural movement

---

## Risk Analysis

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **LinkedIn launches career AI** | HIGH (70%) | HIGH | Move faster, India-specific depth |
| **Fake review scandal** | VERY LOW (10%) | CRITICAL | Face authorization + 4-level verification with ML/DL |
| **Funding shortage** | MEDIUM (40%) | HIGH | Path to profitability by Year 3 |
| **Technical scalability** | LOW (20%) | MEDIUM | Cloud infrastructure, monitoring |
| **Regulatory changes** | MEDIUM (30%) | MEDIUM | DPDP compliance, legal team |
| **Biometric data breach** | LOW (15%) | HIGH | Encrypted storage, secure enclave, GDPR compliance |

### Critical Success Factors

1. **Biometric Trust System:** Face authorization with ML/DL verification creates unparalleled authenticity
2. **Execution Speed:** Must move faster than incumbents
3. **Vernacular Focus:** Own Tier 2/3 markets deeply
4. **Community Density:** Network effects require critical mass
5. **Sustainable Economics:** Profitability insulates from funding cycles

---

## Implementation Roadmap

### Year 1: Foundation
**Q1-Q2:**
- MVP development and launch
- Basic authentication (email/phone OTP)
- Beta testing with 5,000 users
- First 500 verified reviews
- College partnerships (10)

**Q3-Q4:**
- Face authorization system launch
- AI Assistant (text) launch
- Community features rollout
- 50,000 registered users
- First 5,000 premium subscribers
- 95%+ user verification rate achieved

### Year 2: Growth
**Q1-Q2:**
- Voice AI development
- Mobile app launch
- 200,000 registered users
- Break-even achievement

**Q3-Q4:**
- Hindi interface complete
- Creator program launch
- 500,000 registered users
- ₹42 Cr revenue target

### Year 3: Scale
**Q1-Q2:**
- Regional language expansion
- Enterprise features
- 1M registered users
- Profitability achievement

**Q3-Q4:**
- International pilot
- B2B solutions launch
- 100K premium users
- ₹140 Cr revenue target

### Year 4-5: Leadership
- Multi-language support (5+ languages)
- Market leader in vernacular segment
- 5M registered users
- 500K premium users
- ₹400 Cr revenue (Year 5)

---

## Team & Resources

### Core Team Requirements

**Leadership:**
- CEO/Founder (Product & Vision)
- CTO (Technology & Engineering)
- CMO (Marketing & Growth)
- CFO (Finance & Operations)

**Engineering (15-20 people Year 1):**
- Backend Engineers (5)
- Frontend Engineers (4)
- Mobile Developers (3)
- ML Engineers (2)
- Biometric Security Engineer (1)
- DevOps Engineers (2)

**Product & Design (5 people):**
- Product Managers (2)
- UI/UX Designers (2)
- Content Strategist (1)

**Operations (10 people):**
- Community Managers (3)
- Content Moderators (3)
- Customer Support (2)
- Training Coordinators (2)

**Sales & Marketing (8 people):**
- Growth Marketers (3)
- Content Creators (2)
- Partnership Managers (2)
- Sales Representatives (1)

### Funding Requirements

**Seed Round:** ₹5 Cr
- MVP development
- Initial team (15 people)
- Marketing experiments
- 6-month runway

**Series A:** ₹50 Cr
- Product development
- Team scaling (50 people)
- Marketing activation
- 18-month runway

**Series B:** ₹200 Cr
- Geographic expansion
- Technology infrastructure
- Team scaling (200 people)
- International expansion

---

## Appendix

### A. Market Research Data

#### EdTech Funding Trends

| Year | Total Funding | Deal Count | Avg Deal Size | YoY Change |
|------|--------------|------------|---------------|------------|
| 2020 | $2,200M | 179 | $12.3M | +215% |
| 2021 | $4,710M | 322 | $14.6M | +114% |
| 2022 | $2,100M | 187 | $11.2M | -55% |
| 2023 | $297M | 89 | $3.3M | -86% |
| 2024 | $450M (est) | 120 | $3.8M | +51% |

**Key Insight:** 90% decline from peak; must achieve profitability with 50-70% less capital than 2020 cohort

### B. User Research Insights

**Willingness to Pay Analysis:**

| Price Point | Tier 1 Cities | Tier 2/3 Cities | Conversion Rate |
|-------------|---------------|-----------------|-----------------|
| ₹2,999/year | 25-30% | 12-15% | 18-22% blended |
| ₹4,999/year | 15-20% | 5-8% | 10-14% blended |
| ₹7,999/year | 8-12% | 2-4% | 5-8% blended |
| ₹15,000+/year | 3-5% | <1% | 2-3% blended |

### C. Technology Specifications

**Infrastructure Requirements:**
- 99.9% uptime SLA
- <200ms API response time
- Support 10M concurrent users
- 100TB data storage
- Multi-region deployment

**Security & Compliance:**
- DPDP Act compliance
- ISO 27001 certification
- PCI DSS compliance
- End-to-end encryption
- **Biometric Security Standards:**
  - ISO/IEC 19794-5 (Face image data)
  - ISO/IEC 30107 (Biometric presentation attack detection)
  - FIDO2 compliance for authentication
  - Secure biometric data storage (encrypted embeddings only)
  - Right to deletion of biometric data
- Regular security audits
- Penetration testing quarterly

### D. Financial Projections Detail

**Revenue Breakdown (Year 5 - Base Case):**
- Subscription Revenue: ₹280 Cr (70%)
- Corporate Training: ₹80 Cr (20%)
- Placement Services: ₹40 Cr (10%)
- **Total Revenue:** ₹400 Cr

**Cost Structure (Year 5):**
- Technology & Infrastructure: ₹60 Cr (15%)
- Salaries & Benefits: ₹120 Cr (30%)
- Marketing & Sales: ₹80 Cr (20%)
- Content & Operations: ₹40 Cr (10%)
- G&A: ₹20 Cr (5%)
- **Total Costs:** ₹320 Cr
- **EBITDA:** ₹80 Cr (20% margin)

### E. Success Stories Framework

**Outcome Tracking Methodology:**
1. Pre-platform baseline (salary, role, satisfaction)
2. Platform engagement metrics
3. Actions taken (courses, applications, networking)
4. Post-platform outcomes (new job, salary increase)
5. Attribution analysis (platform contribution)
6. Long-term follow-up (6, 12, 24 months)

### F. Regulatory Compliance

**DPDP Act 2023 Compliance:**
- User consent mechanisms
- Data minimization practices
- Right to erasure implementation
- Data localization compliance
- Privacy by design architecture

### G. Partnership Framework

**College Partnership Model:**
- Official platform status
- Student data access (with consent)
- Placement tracking collaboration
- Alumni network integration
- Revenue sharing on conversions

**Corporate CSR Partnership:**
- Schedule VII alignment
- Impact measurement framework
- Quarterly reporting structure
- Brand collaboration opportunities
- Long-term MOUs (3-5 years)

### H. ML/DL Fraud Detection System Specifications

**Document Verification Pipeline:**
1. **Image Preprocessing:**
   - Resolution enhancement
   - Noise reduction
   - Text extraction using OCR

2. **Facial Recognition System:**
   - **Face Detection:** MTCNN/RetinaFace for accurate face detection
   - **Face Embedding:** FaceNet/ArcFace for 128/512-dimensional embeddings
   - **Liveness Detection:**
     - Challenge-response (blink, smile, turn head)
     - 3D depth analysis using mobile sensors
     - Texture analysis to detect printed photos
     - Motion detection for video replay attacks
   - **Performance Metrics:**
     - False Accept Rate (FAR): <0.1%
     - False Reject Rate (FRR): <1%
     - Average processing time: <1 second
     - Accuracy: 99.5%+ on LFW benchmark

3. **Deep Learning Models:**
   - **CNN Architecture:** ResNet-50 for ID card classification
   - **Face Recognition Model:** MobileFaceNet for mobile deployment
   - **Accuracy Target:** 98%+ for genuine document detection
   - **False Positive Rate:** <2%
   - **Processing Time:** <3 seconds per document

4. **Fraud Detection Algorithms:**
   - **Behavioral Analysis:**
     - User activity patterns
     - Review submission timing
     - Content similarity scores
   - **Document Forensics:**
     - Metadata analysis
     - Pixel-level manipulation detection
     - Font and formatting consistency checks
   - **Biometric Verification:**
     - Face-to-ID document matching
     - Cross-reference with previous submissions
     - Duplicate account detection via face matching

5. **Verification Levels:**
   - **Level 1 (Basic):** Email/phone verification
   - **Level 2 (Standard):** Document upload + face verification
   - **Level 3 (Premium):** Manual review + ML verification + liveness check
   - **Level 4 (Trusted):** Multiple verifications + history + periodic re-verification

6. **Training Data:**
   - 100,000+ verified genuine documents
   - 50,000+ known fraudulent samples
   - 500,000+ face images for recognition model
   - 100,000+ spoofing attack samples
   - Continuous learning from new submissions
   - Monthly model retraining cycles

7. **Privacy & Security:**
   - Face embeddings encrypted at rest
   - GDPR/DPDP compliant data handling
   - Biometric data deletion upon request
   - No raw face images stored after processing
   - Secure enclave for biometric processing

---

## Document Control

**Version History:**
- v1.0 - Initial draft (ambitious projections)
- v2.0 - Market reality check
- v3.0 - Competitive assessment revision
- v4.0 - Financial model calibration
- v5.0 - Investment-ready version (current)

**Review & Approval:**
- Product Team: ✅ Approved
- Engineering Team: ✅ Feasibility confirmed
- Finance Team: ✅ Model validated
- Legal Team: ✅ Compliance verified
- Board: ⏳ Pending review

**Next Steps:**
1. Investor pitch deck preparation
2. Technical architecture deep-dive
3. Go-to-market strategy refinement
4. Team recruitment initiation
5. MVP development kickoff

---

## Contact Information

**Sameer Swain**  
Founder & CEO, 2minreview  
Email: sameer@2minreview.com  
LinkedIn: [linkedin.com/in/sameerswain](#)  

**For Investors:** investors@2minreview.com  
**For Partnerships:** partnerships@2minreview.com  
**For Media:** press@2minreview.com  

---

*"Ekta Hi Bal Hai" - Unity is Strength*

**Building India's Most Trusted Career Transformation Platform**

---

© 2025 2minreview. All Rights Reserved.