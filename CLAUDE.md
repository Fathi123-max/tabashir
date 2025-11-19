# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tabashir HR Consulting is a modern web application built with Next.js 15.2.4, serving as the web interface for the Tabashir platform. It provides comprehensive HR consulting services including job matching, candidate management, AI-powered resume optimization, payment processing, and a full-featured admin dashboard.

This web app shares the same backend API that serves the Flutter mobile app (`tabashir-mobile`), with RESTful endpoints under `/api/`.

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 15.2.4 | React framework with App Router |
| Language | TypeScript | 5.8.3 | Type-safe development |
| Database | PostgreSQL | - | Primary data store |
| ORM | Prisma | 6.8.2 | Database ORM and migration tool |
| Authentication | NextAuth.js | 5.0.0-beta.28 | Authentication and session management |
| Styling | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| UI Components | Radix UI + Shadcn | Latest | Accessible UI primitives and components |
| Forms | React Hook Form + Zod | Latest | Form handling with validation |
| State Management | Zustand | Latest | Client-side state management |
| HTTP Client | Next.js Route Handlers | - | API routes |
| Payments | Stripe | ^18.1.0 | Payment processing |
| File Upload | UploadThing | ^7.7.2 | File upload service |
| Email | Nodemailer | ^7.0.3 | Email sending |
| PDF Processing | pdf-lib, pdf-parse, unpdf | Latest | PDF manipulation |
| Rich Text | TipTap | ^2.12.0 | Rich text editor |
| Charts | Recharts | Latest | Data visualization |
| Icons | Lucide React | ^0.454.0 | Icon library |
| Animation | Framer Motion | ^12.16.0 | Animation library |

## Development Commands

### Getting Started

```bash
# Install dependencies (already installed)
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000 in browser
```

### Building and Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Build type checking (TS compiler)
pnpm type-check  # or: npx tsc --noEmit

# Run linting (ESLint)
pnpm lint
```

**Note**: ESLint and TypeScript errors are ignored during build (see `next.config.mjs`). To check for issues:

```bash
# Run ESLint manually
npx eslint . --ext .ts,.tsx

# Run TypeScript type check
npx tsc --noEmit
```

### Database Operations

```bash
# Generate Prisma client after schema changes
pnpm prisma generate

# Push schema changes to database (development)
pnpm prisma db push

# Create and apply migration
pnpm prisma migrate dev --name migration_name

# Reset database (development only)
pnpm prisma migrate reset

# Open Prisma Studio (database browser)
pnpm prisma studio

# View migration status
pnpm prisma migrate status
```

### Testing

```bash
# Run tests (if Jest/Playwright configured)
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

## Architecture

### Project Structure

```
tabashir-web/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group: Authentication pages
│   │   ├── admin/              # Admin login
│   │   ├── candidate/          # Candidate auth
│   │   └── recruiter/          # Recruiter auth
│   ├── (candidate)/            # Route group: Candidate features
│   ├── (owner)/                # Route group: Admin panel (owner = admin)
│   ├── (recruiter)/            # Route group: Recruiter features
│   ├── api/                    # API routes
│   │   ├── mobile/             # API for Flutter app
│   │   │   ├── resumes/        # Resume CRUD (9 endpoints)
│   │   │   │   ├── [id]/       # Get, Update, Delete resume
│   │   │   │   │   ├── duplicate/
│   │   │   │   │   ├── export/
│   │   │   │   │   │   ├── pdf/
│   │   │   │   │   │   └── word/
│   │   │   │   │   └── translate/
│   │   │   │   └── route.ts    # List, Create resumes
│   │   │   └── test/           # API health check
│   │   ├── admin/              # Admin API endpoints
│   │   ├── auth/               # NextAuth configuration
│   │   ├── stripe/             # Stripe webhook handler
│   │   ├── uploadthing/        # File upload API
│   │   └── webhooks/           # Webhook handlers
│   ├── components/             # Shared UI components
│   ├── forgot-password/        # Password reset pages
│   ├── reset-password/         # Password reset confirmation
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── actions/                    # Server Actions
├── components/                 # Reusable UI components
│   └── ui/                     # Shadcn UI components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── auth.ts                 # NextAuth configuration
│   ├── validations.ts          # Zod schemas
│   └── utils.ts                # Helper functions
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Migration files
├── public/                     # Static assets
├── styles/                     # Global styles
├── types/                      # TypeScript type definitions
├── components.json             # Shadcn UI configuration
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

### Route Groups

Next.js route groups (folders in parentheses) organize routes without affecting URL structure:

- **`(auth)/`**: Authentication pages for all user types (admin, candidate, recruiter)
- **`(candidate)/`**: Candidate dashboard and features
- **`(owner)/`**: Admin panel (note: "owner" refers to admin users)
- **`(recruiter)/`**: Recruiter dashboard and job management

### App Router Structure

Each route group contains:
- `page.tsx`: Main page component
- `layout.tsx`: Nested layout (optional)
- `loading.tsx`: Loading UI (optional)
- `error.tsx`: Error boundary (optional)
- `_components/`: Page-specific components

Example: `app/(owner)/admin/dashboard/page.tsx`

### API Routes

API routes are located in `app/api/` and serve both the web app and the Flutter mobile app:

#### Mobile API (`/api/mobile/`)

Endpoints specifically designed for the Flutter app:

```
GET    /api/mobile/test               # Health check
GET    /api/mobile/resumes            # List all resumes
POST   /api/mobile/resumes            # Upload new resume
GET    /api/mobile/resumes/[id]       # Get specific resume
PUT    /api/mobile/resumes/[id]       # Update resume
DELETE /api/mobile/resumes/[id]       # Delete resume
POST   /api/mobile/resumes/[id]/duplicate
POST   /api/mobile/resumes/[id]/export/pdf
POST   /api/mobile/resumes/[id]/export/word
POST   /api/mobile/resumes/[id]/translate
```

**Authentication**: All mobile API endpoints require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

See `QUICK_REFERENCE.md` (root) for complete API documentation.

#### Other API Endpoints

- **`/api/auth/*`**: NextAuth.js authentication endpoints
- **`/api/admin/*`**: Admin panel API
- **`/api/stripe/*`**: Stripe webhook handler
- **`/api/uploadthing/*`**: File upload API
- **`/api/webhooks/*`**: Generic webhook handlers

### Database Schema

The database schema is defined in `prisma/schema.prisma` with the following core models:

#### User Management

- **User**: Central user model with `userType` enum (CANDIDATE, ADMIN, RECRUITER)
- **Candidate**: Extended profile for job seekers
- **Recruiter**: Extended profile for recruiters
- **Owner**: Admin users (separate from Recruiter)

#### Job System

- **Job**: Job postings with status tracking (ACTIVE, PAUSED, CLOSED)
- **JobApplication**: Applications with status and review tracking
- **SavedJobPost**: User saved jobs
- **JobLike**: Job likes/interests

#### Resume System

- **Resume**: Uploaded resume documents
- **AiResume**: AI-generated resumes

#### Admin System

- **AdminPermission**: Granular permissions (MANAGE_USERS, MANAGE_JOBS, etc.)
- **AdminPermissionAssignment**: User permission assignments

#### Payment System

- **Subscription**: User subscriptions (Stripe integration)
- **Payment**: Payment transaction records

#### Educational Content

- **Course**: Training courses
- **Module**: Course modules
- **Lesson**: Individual lessons

### Authentication System

The app uses **NextAuth.js 5.0.0-beta.28** for authentication (configured in `lib/auth.ts`):

#### User Types

- **CANDIDATE**: Job seekers
- **ADMIN**: System administrators (SUPER_ADMIN or REGULAR_ADMIN role)
- **RECRUITER**: Job recruiters

#### Admin Roles

- **SUPER_ADMIN**: Full system access, can manage admin permissions
- **REGULAR_ADMIN**: Limited admin access based on assigned permissions

#### Authentication Flow

1. User logs in via NextAuth (credentials, Google, etc.)
2. Session is stored in database (User model)
3. Route protection via NextAuth middleware
4. Role-based access control in route handlers

#### Social Authentication

Supports multiple authentication providers:
- **Credentials** (email/password)
- **Google Sign-In**
- **Apple Sign-In** (configured via NextAuth)

### Payment Integration

**Stripe** is integrated for payment processing:

- **Subscriptions**: Recurring payments for premium features
- **One-time Payments**: One-time service payments
- **Webhook Handling**: `/api/stripe/webhook` processes Stripe events

Configuration:
- `STRIPE_SECRET_KEY`: Server-side Stripe API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Client-side Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification

See `STRIPE_SETUP.md` for detailed payment integration guide.

### File Upload System

**UploadThing** integration for file uploads:

- Resume uploads (PDF, DOC, DOCX)
- Profile images
- Document storage

API routes in `/api/uploadthing/` handle:
- File upload initialization
- File upload completion
- File metadata storage in Prisma

### UI Component System

The app uses **Shadcn UI** with **Radix UI** primitives:

#### Theme Configuration (Tailwind)

```typescript
// tailwind.config.ts
primary: {
  DEFAULT: "#0D57E1",  // Primary blue
  500: "#002B6B",      // Dark blue
}
```

#### Component Structure

```
components/
├── ui/                      # Shadcn UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...                  # All shadcn components
└── [feature]/               # Feature-specific components
```

#### Global Styles

- `app/globals.css`: Global CSS with Tailwind utilities
- CSS variables for dark/light theme support
- Custom animations (accordion, etc.)

### State Management

**Zustand** is used for client-side state management:

```typescript
// Example store
import { create } from 'zustand'

interface AppState {
  user: User | null
  setUser: (user: User) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### Form Handling

**React Hook Form + Zod** for form validation:

```typescript
// Zod schema
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

// Form component
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {},
})
```

### Rich Text Editor

**TipTap** for rich text editing:

- Resume content editing
- Job description editing
- Formatted text with links, emphasis, lists

### Email System

**Nodemailer** for email sending:

- Email verification
- Password reset
- Notification emails

See `EMAIL_VERIFICATION_SYSTEM.md` for detailed email setup.

### Multilingual Support

The app includes multilingual capabilities:

- **Supported Languages**: English, Arabic, Spanish
- **RTL Support**: Arabic right-to-left text direction
- **i18n Configuration**: See `MULTILINGUAL_SYSTEM.md`

Configuration files:
- `lib/i18n/config.ts` - i18n setup
- Translation files in appropriate directories

## Common Development Tasks

### Adding a New Page

1. Create page in appropriate route group:
   ```typescript
   // app/(candidate)/new-feature/page.tsx
   export default function NewFeaturePage() {
     return <div>New Feature</div>
   }
   ```

2. Add layout if needed:
   ```typescript
   // app/(candidate)/layout.tsx
   export default function CandidateLayout({ children }) {
     return <div>{children}</div>
   }
   ```

3. Add loading state (optional):
   ```typescript
   // app/(candidate)/new-feature/loading.tsx
   export default function Loading() {
     return <div>Loading...</div>
   }
   ```

### Adding a New API Route

1. Create route handler:
   ```typescript
   // app/api/feature/route.ts
   import { NextRequest, NextResponse } from 'next/server'

   export async function GET(request: NextRequest) {
     const data = await fetchData()
     return NextResponse.json(data)
   }
   ```

2. Add to Prisma schema if database changes needed

3. Run migration:
   ```bash
   pnpm prisma migrate dev --name add_feature
   pnpm prisma generate
   ```

### Database Schema Changes

1. Edit `prisma/schema.prisma`

2. Create migration:
   ```bash
   pnpm prisma migrate dev --name descriptive_name
   ```

3. Generate client:
   ```bash
   pnpm prisma generate
   ```

4. Update TypeScript types if necessary

### Adding a Server Action

1. Create action in `actions/`:
   ```typescript
   // actions/createJob.ts
   'use server'

   import { revalidatePath } from 'next/cache'
   import { prisma } from '@/lib/prisma'

   export async function createJob(data: JobData) {
     await prisma.job.create({ data })
     revalidatePath('/admin/jobs')
   }
   ```

2. Call from client component:
   ```typescript
   // Client component
   import { createJob } from '@/actions/createJob'

   <form action={createJob}>
     {/* form fields */}
   </form>
   ```

### Environment Variables

Required environment variables (`.env`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tabashir"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# Stripe
STRIPE_SECRET_KEY="sk_live_or_test"
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_or_test"

# File Upload
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# OpenAI (for AI features)
OPENAI_API_KEY="sk-..."

# Email
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="password"
```

## Configuration Files

### next.config.mjs

```javascript
{
  eslint: {
    ignoreDuringBuilds: true,  // ESLint ignored during build
  },
  typescript: {
    ignoreBuildErrors: true,   // TypeScript errors ignored during build
  },
  images: {
    unoptimized: true,         // No Next.js image optimization
  },
}
```

**Note**: ESLint and TypeScript errors are intentionally ignored during build. Run `pnpm lint` and `pnpm type-check` manually to catch issues.

### tailwind.config.ts

- Dark mode enabled with `class` strategy
- Custom color palette (primary blue, gradients)
- Typography plugin enabled
- Animation utilities configured

### tsconfig.json

- Strict TypeScript configuration
- Path aliases configured (`@/*` → `./`)
- Next.js specific settings

### components.json

Shadcn UI configuration defining installed components.

## Deployment

### Build Process

```bash
# Build for production
pnpm build

# Output: .next/ directory with build artifacts
```

### Deployment Platforms

- **Vercel**: Optimized for Next.js
- **Netlify**: Works with static exports
- **Railway/Heroku**: Full-stack deployment
- **AWS/GCP/Azure**: Custom server deployment

### Environment Setup

1. Set all required environment variables on deployment platform
2. Run database migrations: `pnpm prisma migrate deploy`
3. Generate Prisma client: `pnpm prisma generate`
4. Build: `pnpm build`
5. Start server: `pnpm start`

### Database Migration for Production

```bash
# For production deployments
pnpm prisma migrate deploy

# Alternative: push schema (development only)
pnpm prisma db push
```

## Build Cache and Issues

### Common Build Issues

**If build fails:**

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   pnpm build
   ```

2. **Clear node_modules:**
   ```bash
   rm -rf node_modules
   pnpm install
   pnpm build
   ```

3. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

4. **Check for ESLint errors:**
   ```bash
   npx eslint . --ext .ts,.tsx
   ```

## Code Quality

### Linting

- **ESLint**: Configuration in `.eslintrc.json` (or similar)
- **Build-time linting is disabled** (see `next.config.mjs`)
- Run linting manually: `pnpm lint`

### Type Safety

- **TypeScript**: Strict mode enabled
- **Build-time type checking is disabled** (see `next.config.mjs`)
- Run type checking manually: `npx tsc --noEmit`

### Code Formatting

- **Prettier**: Recommended for code formatting
- Run: `npx prettier --write .`

## Performance Optimization

### Image Optimization

**Disabled** in `next.config.mjs` (`unoptimized: true`)

If enabling image optimization:

1. Set `images: { unoptimized: false }` in `next.config.mjs`
2. Configure image domains in `next.config.mjs`

### Caching

- **Next.js Route Handlers**: Include appropriate cache headers
- **Prisma**: Database query results cached in Prisma client
- **Static Assets**: Served via CDN in production

## Important Notes

- **Route Groups**: `(auth)`, `(candidate)`, etc. don't affect URL structure
- **API for Mobile**: `/api/mobile/*` endpoints serve the Flutter app
- **Authentication**: JWT-based authentication for mobile, NextAuth for web
- **Build Warnings**: ESLint and TypeScript errors are ignored during build
- **Database**: Always use Prisma migrations, never edit DB directly
- **Generated Files**: Prisma client is generated, not committed
- **Environment Variables**: Required in both development and production
- **Webhooks**: Configure webhooks in Stripe dashboard pointing to `/api/stripe/webhook`

## Related Documentation

- **Root CLAUDE.md**: `/Users/Apple/Documents/tabashir/CLAUDE.md` - Monorepo overview
- **Project Docs**: `/Users/Apple/Documents/tabashir/tabashir-web/DOCUMENTATION.md` - Complete architecture
- **API Reference**: `/Users/Apple/Documents/tabashir/QUICK_REFERENCE.md` - Resume API quick reference
- **Stripe Setup**: `/Users/Apple/Documents/tabashir/tabashir-web/STRIPE_SETUP.md` - Payment integration
- **Email System**: `/Users/Apple/Documents/tabashir/tabashir-web/EMAIL_VERIFICATION_SYSTEM.md` - Email configuration
- **Multilingual**: `/Users/Apple/Documents/tabashir/tabashir-web/MULTILINGUAL_SYSTEM.md` - i18n setup

## Key Technologies Quick Reference

### UI Libraries

- **Tailwind CSS**: Utility classes, configured in `tailwind.config.ts`
- **Shadcn UI**: Component library built on Radix
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### Form & Validation

- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Recharts**: Data visualization

### Data & State

- **Prisma**: ORM and database client
- **Zustand**: Client-side state management
- **TypeScript**: Type safety

### External Services

- **Stripe**: Payments (subscriptions, one-time)
- **UploadThing**: File uploads
- **OpenAI**: AI features (resume optimization, translation)
- **NextAuth.js**: Authentication

## Testing the API

The mobile API can be tested using the provided script:

```bash
# From repository root
./test-resume-api.sh YOUR_JWT_TOKEN
```

Or manually with curl:

```bash
# Health check
curl http://localhost:3000/api/mobile/test \
  -H "Authorization: Bearer TOKEN"

# List resumes
curl http://localhost:3000/api/mobile/resumes \
  -H "Authorization: Bearer TOKEN"
```

See `QUICK_REFERENCE.md` (root) for complete endpoint documentation.
