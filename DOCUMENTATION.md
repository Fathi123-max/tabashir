# Tabashir HR Consulting - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [User Types & Access](#user-types--access)
7. [Admin Panel](#admin-panel)
8. [Payment Integration](#payment-integration)
9. [AI Features](#ai-features)
10. [External APIs & Services](#external-apis--services)
11. [File Upload System](#file-upload-system)
12. [Multilingual Support](#multilingual-support)
13. [Email System](#email-system)
14. [API Endpoints](#api-endpoints)
15. [Environment Variables](#environment-variables)
16. [Deployment](#deployment)
17. [Development Setup](#development-setup)

---

## Project Overview

Tabashir HR Consulting is a comprehensive HR platform built with Next.js that provides job matching, resume optimization, and career services. The platform serves three main user types: candidates, recruiters, and administrators.

### Key Features
- **AI-Powered Resume Optimization**: OpenAI integration for resume enhancement
- **Job Matching & Applications**: Smart job matching with easy apply functionality
- **Payment Processing**: Stripe integration for service payments
- **Multi-language Support**: English and Arabic with RTL support
- **Admin Dashboard**: Comprehensive admin panel with role-based permissions
- **File Management**: UploadThing integration for file uploads
- **Email Verification**: Automated email verification system

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (React 19)
- **Styling**: Tailwind CSS 3.4.17 with custom configuration
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **State Management**: Zustand

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js 5.0.0-beta.28
- **File Uploads**: UploadThing
- **PDF Processing**: pdf-lib, pdf-parse, unpdf
- **Email**: Nodemailer

### External Services
- **AI**: OpenAI GPT-4o
- **Payments**: Stripe
- **File Storage**: UploadThing
- **Email**: SMTP (configurable)

### Development Tools
- **Language**: TypeScript 5.8.3
- **Package Manager**: pnpm
- **Database Migration**: Prisma
- **Code Quality**: ESLint (build ignored)

---

## Architecture

### Project Structure
```
tabashir_hr_consulting/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication layouts
│   │   ├── admin/               # Admin login
│   │   ├── candidate/           # Candidate auth pages
│   │   └── recruiter/           # Recruiter auth pages
│   ├── (candidate)/             # Candidate dashboard & features
│   ├── (owner)/                 # Admin panel (owner = admin)
│   ├── (recruiter)/             # Recruiter dashboard
│   ├── api/                     # API routes
│   └── components/              # Shared components
├── actions/                     # Server actions
├── components/                  # Reusable UI components
├── lib/                         # Utility libraries
├── prisma/                      # Database schema & migrations
└── types/                       # TypeScript type definitions
```

### Route Groups
- **(auth)**: Authentication pages for all user types
- **(candidate)**: Candidate-specific features (dashboard, jobs, resume, etc.)
- **(owner)**: Admin panel (note: "owner" refers to admin users)
- **(recruiter)**: Recruiter dashboard and job management

---

## Database Schema

### Core Models

#### User
Central user model supporting multiple user types:
```sql
- id: String (CUID)
- name: String?
- email: String? (unique)
- emailVerified: DateTime?
- password: String?
- userType: UserType (CANDIDATE | ADMIN | RECURITER)
- adminRole: AdminRole? (SUPER_ADMIN | REGULAR_ADMIN)
- jobCount: Int (for AI job applications)
- aiJobApplyCount: Int
- referralCode: String?
- resetToken: String?
- resetTokenExpiry: DateTime?
```

#### Candidate
```sql
- id: String (CUID)
- userId: String (unique, foreign key)
- profile: CandidateProfile (1-to-1)
- resumes: Resume[] (1-to-many)
- aiResumes: AiResume[] (1-to-many)
```

#### Job
```sql
- id: String (CUID)
- title: String
- company: String
- jobType: String
- salaryMin/Max: Int
- location: String?
- description: String
- requirements: String
- benefits: String[]
- status: JobStatus (ACTIVE | PAUSED | CLOSED)
- externalApiJobId: String? (for external job APIs)
- ownerId/recruiterId: String? (either owner or recruiter)
```

#### Payment & Subscriptions
```sql
Payment:
- amount: Float
- currency: String (default: AED)
- status: PaymentStatus
- paymentMethod: String (default: stripe)
- transactionId: String?

Subscription:
- plan: PlanType (BUSINESS | PRO_PLAYER | AI_JOB_APPLY | LINKEDIN_OPTIMIZATION)
- status: SubscriptionStatus
- startDate/endDate: DateTime
```

### AI Resume System
Complex schema supporting AI-generated resumes:
- **AiResume**: Main resume record with status tracking
- **AiResumePersonalDetails**: Personal information
- **AiProfessionalDetails**: Professional summary
- **AiEmploymentHistory**: Work experience
- **AiEducation**: Educational background
- **AiSkill**: Skills with proficiency levels
- **AiLanguage**: Language proficiency

---

## Authentication System

### Providers
1. **Google OAuth**: Automatic email verification
2. **Credentials**: Email/password with manual verification

### Authentication Flow
```mermaid
graph TD
    A[User Registration] --> B{Provider Type}
    B -->|Google| C[Auto-verify Email]
    B -->|Credentials| D[Send Verification Email]
    D --> E[User Clicks Link]
    E --> F[Email Verified]
    C --> G[User Can Login]
    F --> G
    G --> H{User Type}
    H -->|CANDIDATE| I[/dashboard]
    H -->|ADMIN| J[/admin/dashboard]
    H -->|RECRUITER| K[/recruiter/dashboard]
```

### Email Verification
- Required for credential-based users
- Google OAuth users auto-verified
- 24-hour token expiration
- Resend functionality available

### Password Reset
- Secure token-based system
- 1-hour token expiration
- Email delivery with reset link

---

## User Types & Access

### 1. Candidates
**Access**: `/dashboard` and candidate routes
**Features**:
- Job browsing and applications
- Resume upload and AI optimization
- Profile management
- Service purchases (AI job apply, LinkedIn optimization, etc.)
- Interview training access

### 2. Recruiters
**Access**: `/recruiter/dashboard`
**Features**:
- Job posting and management
- Application tracking
- Company profile management
- Integration with external job APIs

### 3. Administrators
**Access**: `/admin/dashboard`
**Roles**:
- **Super Admin**: Full access to all features
- **Regular Admin**: Limited permissions

---

## Admin Panel

### Access
- **URL**: `/admin/dashboard`
- **Login**: `/admin/login`
- **Authentication**: Required `userType: "ADMIN"`

### Permission System
Role-based access control with granular permissions:

#### Available Permissions
- `MANAGE_USERS`: User management
- `MANAGE_JOBS`: Job management
- `MANAGE_APPLICATIONS`: Application oversight
- `MANAGE_PAYMENTS`: Payment tracking
- `MANAGE_DASHBOARD`: Dashboard access
- `MANAGE_INTERVIEWS`: Interview management
- `MANAGE_AI_CV`: AI resume management
- `MANAGE_HELP`: Help center management
- `MANAGE_ACCOUNT`: Account settings
- `MANAGE_ADMIN_PERMISSIONS`: Admin user management (Super Admin only)

#### Default Role Permissions
**Super Admin**:
- All permissions including `MANAGE_ADMIN_PERMISSIONS`

**Regular Admin**:
- `MANAGE_DASHBOARD`
- `MANAGE_APPLICATIONS`
- `MANAGE_ACCOUNT`

### Admin Features
1. **Dashboard**: Analytics and statistics
2. **User Management**: View and manage all users
3. **Job Management**: Oversee all job postings
4. **Application Tracking**: Monitor job applications
5. **Payment Management**: Track payments and subscriptions
6. **AI Resume Management**: Monitor AI resume generation
7. **Admin Management**: Create/manage admin users (Super Admin only)

---

## Payment Integration

### Stripe Integration
Primary payment processor with comprehensive webhook handling.

#### Services & Pricing (AED)
- **AI Job Apply**: 200 AED (adds 200 job applications + 1 AI apply count)
- **LinkedIn Optimization**: 60 AED
- **ATS CV Optimization**: 40 AED
- **Interview Training**: 150 AED

#### Payment Flow
1. User selects service
2. Stripe checkout session created
3. User redirected to Stripe hosted checkout
4. Payment processed
5. Webhook updates database
6. User receives service access

#### Webhook Events
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Legacy Ziina Integration
Maintained for backward compatibility but being phased out.

---

## AI Features

### OpenAI Integration
**Model**: GPT-4o
**Primary Use**: Resume optimization and transformation

#### Resume Processing Pipeline
1. **Upload**: User uploads PDF resume
2. **Text Extraction**: PDF parsed using unpdf library
3. **AI Processing**: OpenAI transforms content
4. **Enhancement**: Professional formatting and optimization
5. **Storage**: Transformed content saved to database

#### AI Prompt Strategy
Comprehensive system prompt for:
- Content enhancement and professionalization
- Grammar and formatting corrections
- Skills extraction and highlighting
- Leadership and project identification
- Section optimization (minimum 3 bullet points per experience)

### AI Job Matching
- Matches user CV to best 200 jobs from database
- Automatic job applications on user's behalf
- Smart matching algorithm based on skills and experience

---

## External APIs & Services

### Job APIs
Integration with external job boards for comprehensive job listings:
- Job creation via external APIs
- Job updates and synchronization
- External job ID tracking for data consistency

### UploadThing
File upload service integration:
- **Image Uploads**: Profile pictures, company logos (4MB max)
- **Resume Uploads**: PDF files (2MB max)
- **Authentication**: Session-based access control
- **File Types**: Images (PNG, JPG) and PDFs

### Email Services
SMTP integration for:
- Email verification
- Password reset
- Service notifications
- LinkedIn optimization notifications

---

## File Upload System

### UploadThing Configuration
Three upload endpoints:

1. **imageUploader**: General images (4MB, 1 file)
2. **profilePictureUploader**: Profile pictures (4MB, 1 file)
3. **resumeUploader**: PDF resumes (2MB, 1 file)

### Security
- Authentication required for most uploads
- File type restrictions
- Size limitations
- User ID tracking in metadata

---

## Multilingual Support

### Languages
- **English**: Default language
- **Arabic**: Full RTL (Right-to-Left) support

### Implementation
- Custom translation hook: `useTranslation()`
- Persistent language preference (localStorage)
- Dynamic direction switching (LTR/RTL)
- Comprehensive translation keys for all UI elements

### Usage Example
```tsx
import { useTranslation } from "@/lib/use-translation";

function MyComponent() {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className={isRTL ? 'text-right' : ''}>
      <h1>{t('dashboard')}</h1>
    </div>
  );
}
```

---

## Email System

### Configuration
SMTP-based email system using Nodemailer:
- Configurable SMTP server
- SSL/TLS support
- Template-based HTML emails

### Email Types
1. **Verification Emails**: Account activation
2. **Password Reset**: Secure password recovery
3. **Service Notifications**: Payment confirmations
4. **LinkedIn Optimization**: Service-specific notifications

### Email Templates
Professional HTML templates with:
- Company branding
- Responsive design
- Clear call-to-action buttons
- Security information

---

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `GET /api/auth/verify-email` - Email verification

### Payments
- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/ziina` - Ziina webhook handler (legacy)
- `POST /api/payment-intent` - Create payment intent
- `GET /api/payments/latest` - Latest payment info

### File Uploads
- `POST /api/uploadthing` - File upload handling

### AI & Resumes
- `POST /api/ai-resume/create` - Create AI resume

### User Management
- `GET /api/user/profile` - User profile data
- `POST /api/candidate/onboarding/personal-info` - Personal info update
- `POST /api/candidate/onboarding/professional-info` - Professional info update

### Subscriptions
- `GET /api/subscription/latest` - Latest subscription info
- `GET /api/subscription/debug` - Debug subscription data
- `GET /api/subscription/test` - Test subscription endpoints

---

## Environment Variables

### Required Variables

#### Database
```env
DATABASE_URL="postgresql://..."
```

#### Authentication
```env
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### Google OAuth
```env
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

#### Stripe
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### OpenAI
```env
OPENAI_API_KEY="sk-..."
```

#### UploadThing
```env
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"
```

#### Email (SMTP)
```env
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="465"
EMAIL_ADDRESS="your-email@domain.com"
EMAIL_PASSWORD="your-app-password"
```

#### Application
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_NODE_ENV="development"
```

#### Legacy Payment (Ziina)
```env
ZIINA_API_KEY="your-ziina-key"
ZIINA_WEBHOOK_SECRET="your-webhook-secret"
```

---

## Deployment

### Build Process
```bash
npm run build
npm run start
```

### Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
```

### Environment Setup
1. Set all required environment variables
2. Configure database connection
3. Set up Stripe webhooks
4. Configure SMTP for emails
5. Set up UploadThing for file uploads

### Production Considerations
- Use production Stripe keys
- Set secure NEXTAUTH_SECRET
- Configure proper CORS settings
- Set up SSL certificates
- Configure database backups

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd tabashir_hr_consulting

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma migrate dev
npx prisma generate

# Start development server
pnpm dev
```

### Development Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Commands
```bash
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev      # Run migrations
npx prisma db push          # Push schema changes
npx prisma generate         # Generate Prisma client
```

---

## Additional Features

### Job Application System
- Easy apply functionality
- Application tracking
- Status management
- Integration with external job APIs

### Resume Management
- Multiple resume support
- AI-powered optimization
- PDF processing and text extraction
- ATS compatibility optimization

### Service Marketplace
- Multiple HR services
- Secure payment processing
- Service delivery tracking
- User access management

### Analytics & Reporting
- Admin dashboard with statistics
- Payment tracking
- User activity monitoring
- Job application analytics

---

## Security Features

### Authentication Security
- Secure password hashing (bcrypt)
- JWT-based sessions
- Email verification requirement
- Password reset with time-limited tokens

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection
- CSRF protection via NextAuth.js

### File Upload Security
- File type validation
- Size limitations
- Authentication requirements
- Secure file storage

### Payment Security
- Stripe's secure payment processing
- Webhook signature verification
- Transaction logging
- PCI compliance through Stripe

---

## Support & Maintenance

### Logging
- Comprehensive error logging
- Payment transaction logging
- User activity tracking
- API request monitoring

### Monitoring
- Database query monitoring via Prisma
- Payment webhook monitoring
- Email delivery tracking
- File upload monitoring

### Backup Strategy
- Database backups
- File storage backups
- Configuration backups
- Regular backup testing

---

This documentation provides a comprehensive overview of the Tabashir HR Consulting platform. For specific implementation details, refer to the source code and individual component documentation.
