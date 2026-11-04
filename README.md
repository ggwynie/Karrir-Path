# KarrirPath

Platform karir all-in-one untuk job seekers, mentors, dan recruiters di Indonesia.

**Live Demo:** [https://karrir-path.vercel.app](https://karrir-path.vercel.app)

## Overview

KarrirPath adalah platform yang menghubungkan pencari kerja dengan peluang karir, mentor profesional, dan perusahaan. Platform ini menyediakan sistem matching otomatis, AI-powered career roadmap, dan dashboard lengkap untuk semua stakeholder.

## Key Features

**For Job Seekers**
- Job board dengan filter lokasi dan kategori (Full-Time, Part-Time, Freelance, Magang)
- Smart matching system berdasarkan skills dan pengalaman
- Profile builder lengkap dengan CV, skills, pengalaman, pendidikan, dan sertifikat
- Apply validation - hanya bisa melamar jika profil sudah lengkap
- AI-powered career roadmap generator menggunakan Google Gemini

**For Mentors**
- Comprehensive mentor dashboard untuk kelola sesi, jadwal, dan komunikasi
- Profile management dengan expertise, tarif, portfolio, dan availability
- Analytics & payment tracking dengan breakdown fee platform
- Real-time chat dengan mentees
- Automatic role assignment setelah profil diverifikasi lengkap

**For Recruiters**
- Company dashboard untuk posting dan kelola lowongan
- Candidate search dan filtering
- Application management system

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** CSS Modules, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL, Prisma ORM
- **Authentication:** NextAuth.js (Google OAuth + Credentials)
- **AI Integration:** Google Gemini API
- **Deployment:** Vercel (Frontend), Railway (Database)

## Architecture Highlights

- Server-side rendering dengan Next.js App Router
- Type-safe database queries dengan Prisma
- Role-based access control (job-seeker, mentor, recruiter)
- Session management dengan JWT
- RESTful API design
- Responsive design untuk mobile dan desktop

## Database Schema

**Core Models:**
- User - Multi-role user accounts
- MentorProfile - Extended profile untuk mentor dengan certifications, projects, education
- Account & Session - NextAuth integration
- Roadmap - AI-generated career paths

**Key Relationships:**
- One-to-one: User to MentorProfile
- One-to-many: User to Roadmaps
- OAuth integration via Account model

## Project Structure

```
app/
├── api/                  # API endpoints
│   ├── auth/            # Authentication
│   ├── chat/            # AI chat integration
│   ├── mentor/          # Mentor profile management
│   └── roadmap/         # Roadmap generator
├── components/          # Reusable UI components
├── dashboard/           # Role-specific dashboards
│   ├── company/         # Recruiter interface
│   ├── mentorship/      # Mentor interface
│   ├── profile/         # Job seeker profile
│   └── seekers/         # Job seeker dashboard
└── jobs/                # Job listings by type

lib/
├── auth.ts              # NextAuth configuration
└── prisma.ts            # Database client

prisma/
└── schema.prisma        # Database schema definition
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- MySQL database
- Google OAuth credentials
- Google Gemini API key

### Quick Start

1. Clone repository
```bash
git clone https://github.com/ggwynie/Karrir-Path.git
cd Karrir-Path
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (`.env.local`)
```env
DATABASE_URL="mysql://user:password@host:port/database"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GEMINI_API_KEY=your-api-key
```

4. Initialize database
```bash
npx prisma generate
npx prisma db push
```

5. Run development server
```bash
npm run dev
```

## Deployment

Application deployed on Vercel with Railway MySQL database. Environment variables configured via Vercel dashboard. Database schema synchronized using Prisma migrations.
