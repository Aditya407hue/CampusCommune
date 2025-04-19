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

### Profile

- userId (Id, references users)
- role (enum: student, admin)
- name (string)
- department (string)
- graduationYear (number)
- skills (array of strings)
- resumeFileId (optional, Id references _storage)

### Job

- title (string)
- company (string)
- description (string)
- location (string)
- type (enum: full-time, internship, part-time)
- skills (array of strings)
- salary (optional, number)
- deadline (number, Unix timestamp)
- isActive (boolean)
- createdBy (Id, references users)

### Application

- jobId (Id, references jobs)
- studentId (Id, references users)
- status (enum: pending, shortlisted, rejected, accepted)
- appliedAt (number, Unix timestamp)
- resumeFileId (Id, references _storage)

### Notification

- userId (Id, references users)
- type (enum: new_job, status_update, deadline_reminder)
- message (string)
- read (boolean)
- createdAt (number, Unix timestamp)

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
