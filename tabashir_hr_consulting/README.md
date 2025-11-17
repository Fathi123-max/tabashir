# Tabashir HR Consulting

A modern HR consulting platform built with Next.js, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Form Handling:** Shadcn Form with  React Hook Form with Zod validation
- **State Management:** Zustand
- **Payment Processing:** Stripe
- **File Upload:** UploadThing
- **PDF Processing:** PDF-Lib, PDF-Parse, PDFMake

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version)
- pnpm (Package manager)
- PostgreSQL database
- Git

## Getting Started with Zip File

1. Extract the provided zip file to your desired location
2. Open a terminal and navigate to the extracted directory:
```bash
cd path/to/extracted/tabashir_hr_consulting
```

## Environment Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tabashir_hr"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# OpenAI (if using AI features)
OPENAI_API_KEY="your-openai-api-key"
```

## Database Setup

1. Initialize the database:
```bash
pnpm dlx prisma generate
pnpm dlx prisma db push
```

## Development

1. Start the development server:
```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma generate` - Generate Prisma client
- `pnpm prisma db push` - Push database schema changes

## Project Structure

```
├── actions/         # Server actions
├── app/            # Next.js app directory
├── components/     # React components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── prisma/         # Database schema and migrations
├── public/         # Static assets
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```

## Features

- User authentication and authorization
- Job posting and management
- Candidate profile management
- Resume upload and parsing
- AI-powered resume generation
- Job application tracking
- Payment processing
- File upload handling

