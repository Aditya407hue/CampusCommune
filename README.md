# Campus Job Portal

A modern job portal application built with React, TypeScript, Convex, and Tailwind CSS.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Convex (Backend as a Service)
- Styling: Tailwind CSS + shadcn/ui components
- Authentication: Convex Auth

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with your Convex credentials:

   ```
   CONVEX_DEPLOYMENT=your_deployment_url
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will start both the Convex backend and Vite development server.

## Project Structure

- `/src` - Frontend React application

  - `/components` - Reusable UI components
  - `/lib` - Utility functions and helpers
  - `/hooks` - Custom React hooks

- `/convex` - Backend Convex functions and schema
  - `schema.ts` - Database schema definitions
  - `users.ts` - User management functions
  - `jobs.ts` - Job listing functions
  - `applications.ts` - Job application functions

## Database Models

### User

- id (system-generated)
- name (string)
- email (string)
- role (enum: student, admin, recruiter)
- department (string, optional)
- skills (array of strings, optional)

### Job

- id (system-generated)
- title (string)
- company (string)
- location (string)
- description (string)
- requirements (string)
- salary (string, optional)
- jobType (enum: full-time, part-time, internship)
- deadline (timestamp, optional)
- isActive (boolean)
- recruiterId (Id)
- createdAt (timestamp)

### Application

- id (system-generated)
- status (enum: pending, reviewed, accepted, rejected)
- coverLetter (string, optional)
- resumeId (string, optional)
- studentId (Id)
- jobId (Id)
- createdAt (timestamp)

## Features

- User authentication and role-based access
- Job posting and management
- Job application submission and tracking
- Resume upload and management
- Real-time updates using Convex's live queries
- Responsive design with Tailwind CSS

## Development

- Run frontend only: `npm run dev:frontend`
- Run backend only: `npm run dev:backend`
- Run type checking: `npm run lint`
