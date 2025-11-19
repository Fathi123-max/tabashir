# Database Seeding Summary

## Overview

The Tabashir HR database has been successfully seeded with a comprehensive set of test data. This includes realistic data for all user types, jobs, applications, resumes, subscriptions, and more.

## 📊 Data Summary

### Users (19 total)

#### Admins (4)
- **Super Admin**
  - Email: `admin@tabashir.com`
  - Password: `password123`
  - Permissions: All permissions granted

- **Regular Admin**
  - Email: `admin2@tabashir.com`
  - Password: `password123`
  - Permissions: Manage Users, Manage Jobs, Manage Dashboard

#### Owners (2)
- **John Owner** - `owner1@tabashir.com` / `password123`
- **Sarah Owner** - `owner2@tabashir.com` / `password123`

#### Recruiters (5)
- **Ahmed Al-Rashid** - `ahmed@techcorp.com` / `password123` - TechCorp Solutions
- **Sarah Johnson** - `sarah@innovate.io` / `password123` - Innovate.io
- **Mohammed Hassan** - `mohammed@digitalpro.ae` / `password123` - Digital Pro
- **Emma Williams** - `emma@futuretech.com` / `password123` - Future Tech
- **Khalid Al-Mansoori** - `khalid@cloudworks.ae` / `password123` - CloudWorks

#### Candidates (10)
Each with complete profiles including skills, experience, education, and languages:

1. **Ali Mohamed** - `ali@example.com` / `password123`
   - Full Stack Developer, 5 years experience
   - Skills: JavaScript, React, Node.js, TypeScript

2. **Fatima Al-Zahra** - `fatima@example.com` / `password123`
   - Backend Developer, 3 years experience
   - Skills: Python, Django, PostgreSQL, AWS

3. **Omar Abdullah** - `omar@example.com` / `password123`
   - Java Developer, 7 years experience
   - Skills: Java, Spring Boot, Microservices, Kubernetes

4. **Aisha Al-Maktoum** - `aisha@example.com` / `password123`
   - UI/UX Designer, 2 years experience
   - Skills: UI/UX Design, Figma, Adobe XD, Prototyping

5. **Hassan Ali** - `hassan@example.com` / `password123`
   - DevOps Engineer, 8 years experience
   - Skills: DevOps, Docker, Jenkins, Terraform

6. **Layla Ahmed** - `layla@example.com` / `password123`
   - Data Scientist, 4 years experience
   - Skills: Data Science, Machine Learning, Python, TensorFlow

7. **Youssef Ibrahim** - `youssef@example.com` / `password123`
   - Mobile Developer, 6 years experience
   - Skills: Mobile Development, Flutter, React Native, iOS

8. **Noor Al-Sabah** - `noor@example.com` / `password123`
   - Product Manager, 3 years experience
   - Skills: Product Management, Agile, Scrum, Analytics

9. **Karim Mahmoud** - `karim@example.com` / `password123`
   - Cybersecurity Analyst, 9 years experience
   - Skills: Cybersecurity, Network Security, CISSP, Penetration Testing

10. **Zara Khan** - `zara@example.com` / `password123`
    - Digital Marketing Specialist, 2 years experience
    - Skills: Digital Marketing, SEO, Google Ads, Analytics

### Jobs (50 total)
- 48 active jobs
- 2 paused jobs
- Mix of Full-time, Part-time, Contract, and Internship positions
- Salary range: 5,000 - 25,000 AED
- Locations: Dubai, Abu Dhabi, Sharjah, Ajman, Remote
- Companies: 15 different companies
- Job Titles include:
  - Senior Full Stack Developer
  - Frontend/Backend Developer
  - DevOps Engineer
  - UI/UX Designer
  - Product Manager
  - Data Scientist
  - Mobile App Developer
  - Cybersecurity Analyst
  - Digital Marketing Specialist
  - Cloud Architect
  - Machine Learning Engineer
  - And more...

### Applications (235 total)
- Random distribution across jobs
- Status: pending, reviewing, accepted, rejected
- Match scores: 60-100%
- Types: regular and easy_apply

### Resumes (19 total)
- 1-3 resumes per candidate
- Mix of regular and AI-optimized resumes
- Formatted content in HTML
- PDF URLs (mock)

### AI Resumes
- Some candidates have AI-generated resumes
- Complete with personal details, professional summary
- Skills categorized by type
- Language proficiencies defined

### Saved Jobs (53 total)
- 2-10 saved jobs per candidate
- Realistic job matching based on skills

### Subscriptions (10 total)
- Mix of plans: Business, Pro Player, AI Job Apply
- Both active and expired subscriptions
- Auto-renew options

### Payments (20+ total)
- Linked to subscriptions
- Completed payment status
- Transaction IDs for tracking

### Courses (5 total)
- Web Development Bootcamp (Paid)
- Python for Data Science (Paid)
- Digital Marketing Fundamentals (Free)
- AWS Cloud Practitioner Certification (Paid)
- UI/UX Design Masterclass (Paid)

## 🔧 Seeding Commands

### Run Seeding
```bash
pnpm seed
```

### Verify Data
```bash
pnpm tsx verify-seed.ts
```

### Open Prisma Studio
```bash
pnpm prisma studio --port 5555
```

## 🔑 Login Credentials

### Admin Access
- Email: `admin@tabashir.com`
- Password: `password123`
- Role: Super Admin

### Recruiter Access
- Email: `ahmed@techcorp.com`
- Password: `password123`
- Company: TechCorp Solutions

### Candidate Access
- Email: `ali@example.com`
- Password: `password123`
- Profile: Full Stack Developer

## 📝 File Locations

- **Seed Script**: `/prisma/seed.ts`
- **Verification Script**: `/verify-seed.ts`
- **Seeding Config**: `/package.json` (prisma.seed field)

## 🎯 Data Relationships

```
Users (19)
├── Admins (4)
│   └── AdminPermissionAssignment (varies)
├── Recruiters (5)
│   └── Jobs (25)
└── Candidates (10)
    ├── CandidateProfile (10)
    ├── Resume (19)
    ├── AiResume (varies)
    ├── JobApplication (235 across 50 jobs)
    ├── SavedJobPost (53)
    └── Subscription (10)

Jobs (50)
├── Created by Recruiters (25)
├── Created by Owners (25)
└── JobApplication (235)

Subscriptions (10)
└── Payment (2-3 each)
```

## 🚀 Usage Examples

### Accessing Data in Code

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all candidates
const candidates = await prisma.candidate.findMany({
  include: {
    user: true,
    profile: true,
    resumes: true
  }
})

// Get active jobs
const jobs = await prisma.job.findMany({
  where: { isActive: true },
  include: {
    recruiter: true,
    owner: true
  }
})

// Get job applications
const applications = await prisma.jobApplication.findMany({
  include: {
    user: true,
    Job: true
  }
})
```

### Reset and Re-seed

If you need to reset and re-seed the database:

```bash
# Reset database (WARNING: This deletes all data)
pnpm prisma migrate reset

# Or manually clean and re-seed
pnpm prisma db push --force-reset
pnpm seed
```

## ✅ Verification Steps

1. **Check Prisma Studio**: Open http://localhost:5555
2. **Run Verification**: `pnpm tsx verify-seed.ts`
3. **Start Web Server**: `pnpm dev`
4. **Test Login**: Use credentials above

## 📌 Notes

- All passwords are hashed with bcrypt
- Data includes realistic relationships
- Some fields have mock URLs (for file uploads, images)
- Dates are distributed across recent months
- All data is interconnected with proper foreign keys

## 🎨 Customization

To modify the seed data:

1. Edit `/prisma/seed.ts`
2. Adjust counts, add new data, or modify relationships
3. Run `pnpm seed` again to apply changes
4. Use `pnpm prisma migrate reset` first if you want a clean slate

---

**Database Seeded Successfully!** 🎉

Total Records:
- 19 Users (4 Admins, 5 Recruiters, 10 Candidates)
- 50 Jobs
- 235 Job Applications
- 19 Resumes
- 10 Subscriptions
- 53 Saved Jobs
- 5 Courses
- 20+ Payments
