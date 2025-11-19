# Quick Start Guide - Seeded Database

## ✅ Seeding Complete!

Your Tabashir database has been successfully populated with comprehensive test data.

## 📊 What's Been Created

| Data Type | Count |
|-----------|-------|
| **Total Users** | 19 |
| Admins | 4 |
| Recruiters | 5 |
| Candidates | 10 |
| **Jobs** | 50 |
| Active Jobs | 48 |
| **Job Applications** | 235 |
| **Resumes** | 19 |
| **Subscriptions** | 10 |
| **Saved Jobs** | 53 |
| **Courses** | 5 |
| **Payments** | 20+ |

## 🔑 Login Credentials

### Admin Dashboard
```
Email: admin@tabashir.com
Password: password123
```

### Recruiter Account
```
Email: ahmed@techcorp.com
Password: password123
Company: TechCorp Solutions
```

### Candidate Account
```
Email: ali@example.com
Password: password123
Role: Full Stack Developer
```

## 🚀 Next Steps

### 1. Verify the Data (Optional)
```bash
pnpm tsx verify-seed.ts
```

### 2. Open Prisma Studio (Optional)
```bash
pnpm prisma studio
```
Then navigate to: http://localhost:5555

### 3. Start the Web Application
```bash
pnpm dev
```
Then open: http://localhost:3000

## 💻 Access Different Dashboards

### Admin Panel
Navigate to: http://localhost:3000/(owner)/admin/dashboard
- Manage users
- View analytics
- Manage jobs
- View payments

### Recruiter Dashboard
Navigate to: http://localhost:3000/(recruiter)/dashboard
- Post jobs
- View applications
- Manage company profile

### Candidate Dashboard
Navigate to: http://localhost:3000/(candidate)/dashboard
- Browse jobs
- Apply to positions
- Upload resumes
- Track applications

## 🔄 Re-seed the Database

To reset and re-seed with fresh data:

```bash
# Option 1: Complete reset (deletes all data)
pnpm prisma migrate reset
pnpm seed

# Option 2: Force push and re-seed
pnpm prisma db push --force-reset
pnpm seed
```

## 📝 Key Features in Seeded Data

### ✅ User Types
- **Admins**: Full system access with granular permissions
- **Recruiters**: Can post and manage jobs
- **Candidates**: Can browse, save, and apply to jobs

### ✅ Job Postings
- 50 diverse job listings
- Multiple locations (Dubai, Abu Dhabi, Sharjah, Remote)
- Various job types (Full-time, Part-time, Contract)
- Salary ranges from 5K to 25K AED
- Realistic skill requirements

### ✅ Applications
- 235 job applications
- Mix of statuses (pending, reviewing, accepted, rejected)
- Match scores between 60-100%
- Both regular and easy-apply applications

### ✅ Resumes & AI
- 19 uploaded resumes
- AI-generated resume optimization
- Formatted content in HTML/PDF
- Skills and experience tracking

### ✅ Subscriptions & Payments
- Multiple subscription plans
- Stripe payment records
- Active and expired subscriptions
- Transaction tracking

### ✅ Educational Content
- 5 courses (mix of free and paid)
- Categories: Web Dev, Data Science, Marketing, Cloud, Design
- Tagged with bestsellers and new courses

## 📚 Documentation Files

- **SEED_DATA_SUMMARY.md** - Detailed breakdown of all seeded data
- **SEED_QUICK_START.md** - This file (quick reference)
- **verify-seed.ts** - Verification script to check data

## 🎯 Testing Scenarios

With this seeded data, you can test:

1. **Admin Features**:
   - User management
   - Job moderation
   - Analytics dashboard
   - Payment tracking

2. **Recruiter Features**:
   - Job posting
   - Application review
   - Candidate filtering
   - Company profile

3. **Candidate Features**:
   - Job search & filters
   - Save jobs
   - Submit applications
   - Resume upload
   - Track applications

4. **AI Features**:
   - Resume optimization
   - Job matching
   - Skill recommendations

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Ensure PostgreSQL is running
# Check your .env file has correct DATABASE_URL

# Regenerate Prisma client
pnpm prisma generate

# Push schema
pnpm prisma db push
```

### Port Already in Use
```bash
# For Prisma Studio
pnpm prisma studio --port 5556

# For Next.js dev server
pnpm dev -p 3001
```

## ✨ Tips

- All test data is interconnected with proper relationships
- Passwords are hashed with bcrypt (`password123`)
- Sample data includes realistic names, emails, and skills
- Dates are distributed across recent months
- Some mock URLs are used for file uploads

---

**Ready to explore!** 🎉 Start with `pnpm dev` and log in with any of the provided credentials.
