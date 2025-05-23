# Campus Job Portal

## Project Overview

Campus Job Portal is a web application designed to connect students with job opportunities, including full-time positions, internships, and part-time roles. It allows administrators to post and manage job listings, and students to apply for these jobs, upload resumes, and track their applications. The platform aims to streamline the job search process for students and the recruitment process for companies and the campus placement cell.

## Technology Stack

- **Frontend:**
  - React 19
  - Vite (Build Tool)
  - Tailwind CSS (Styling)
  - Shadcn/UI (UI Components)
  - Lucide React (Icons)
  - React Router DOM (Routing)
  - React Hook Form (Form Management)
  - Sonner (Toast Notifications)
  - Next-Themes (Theme Management)
- **Backend & Database:**
  - Convex (Backend-as-a-Service Platform, Real-time Database)
- **Authentication:**
  - Clerk (User Authentication)
- **Other Libraries:**
  - `@google/generative-ai` (Potentially for AI-powered features)
  - `date-fns` (Date utility)
  - `pdf-parse` / `pdfjs-dist` (PDF handling)
  - `react-markdown` / `remark-gfm` (Markdown rendering)

## Diagramming and Design

Lucidchart can be utilized for creating Data Flow Diagrams (DFDs) and Unified Modeling Language (UML) diagrams to visualize the system architecture, data flow, and component interactions. This helps in understanding the project structure and can be useful for planning and documentation.

- **Data Flow Diagrams (DFDs):** Illustrate how data is processed by the system.
- **UML Diagrams:** Provide various perspectives of the system's design, such as use case diagrams, class diagrams, and sequence diagrams.

If you have created any diagrams for this project using Lucidchart, consider linking them here or storing them in a designated project folder.

## Features

- User authentication (students, admins, PRs) and role-based access control.
- Job posting, editing, and management by administrators and PRs.
- Students can browse and search for jobs.
- Students can apply for jobs and upload their resumes.
- Real-time updates for job listings and application statuses using Convex's live queries.
- Profile management for users to update their information and skills.
- Notifications for new job postings, application status updates, and deadlines.
- Responsive design for accessibility across various devices.

## Database Models (Schema)

The database schema is defined in `convex/schema.ts` using Convex's schema definition tools.

### `profiles`

Stores user profile information.

- `userId`: `Id<"users">` (References the `users` table from Clerk/auth)
- `role`: `string` (Enum: "student", "admin", "pr")
- `name`: `string`
- `department`: `string`
- `graduationYear`: `number`
- `skills`: `Array<string>`
- `resumeFileId`: `optional(Id<"_storage">)` (References a file in Convex storage)
- **Index**: `by_user` on `userId`

### `jobs`

Stores job listing details.

- `title`: `optional(string | null)`
- `company`: `optional(string | null)`
- `description`: `optional(string | null)`
- `location`: `optional(string | null)`
- `type`: `optional(string | null)` (Enum: "full-time", "internship", "part-time", "trainee")
- `skills`: `optional(Array<string> | null)`
- `salary`: `optional(object | null)`
  - `stipend`: `optional(string | null)`
  - `postConfirmationCTC`: `optional(string | null)`
- `deadline`: `optional(string | null)` (e.g., "23rd April, 12pm")
- `isActive`: `optional(boolean)`
- `createdBy`: `optional(Id<"users">)` (References the `users` table)
- `applicationLink`: `optional(Array<string> | null)`
- `moreDetails`: `optional(string | null)`
- `isApproved`: `optional(boolean)`
- `approvedBy`: `optional(Id<"users">)`
- **Indexes**:
  - `by_title` on `title`
  - `by_company` on `company`
  - `by_type` on `type`
  - `by_isActive` on `isActive`
  - `by_createdBy` on `createdBy`
  - `search_title_company_description_skills`: Search index on `title`, `company`, `description`, `skills`

### `applications`

Stores job application details.

- `jobId`: `Id<"jobs">` (References the `jobs` table)
- `userId`: `Id<"users">` (References the `users` table)
- `status`: `string` (Enum: "applied", "shortlisted", "rejected", "hired", "interviewing")
- `resumeFileId`: `Id<"_storage">` (References a file in Convex storage)
- `appliedAt`: `number` (Unix timestamp)
- **Indexes**:
  - `by_job_user` on `jobId`, `userId`
  - `by_userId` on `userId`
  - `by_jobId` on `jobId`
  - `by_status` on `status`

### `notifications`

Stores notifications for users.

- `userId`: `Id<"users">` (References the `users` table)
- `type`: `string` (Enum: "new_job", "status_update", "deadline_reminder", "job_approved", "job_rejected")
- `message`: `string`
- `link`: `optional(string)`
- `read`: `boolean`
- `jobId`: `optional(Id<"jobs">)`
- **Indexes**:
  - `by_user` on `userId`
  - `by_read_status` on `userId`, `read`

### `companies` (New table, based on schema.ts)

Stores company information.

- `name`: `string`
- `description`: `optional(string)`
- `website`: `optional(string)`
- `logoUrl`: `optional(string)` (Potentially `Id<"_storage">` if storing logos in Convex)
- **Index**: `by_name` on `name`

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd campus-job-portal
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Convex:**

    - Install the Convex CLI if you haven't already: `npm install -g convex`
    - Log in to your Convex account: `npx convex login`
    - Link your project: `npx convex dev` (This will guide you through creating a new project or linking to an existing one).
    - You will need to set up environment variables for Convex, typically `CONVEX_DEPLOYMENT` in a `.env.local` file or through your Convex project dashboard.

4.  **Set up Clerk Authentication:**

    - Create an account at [Clerk.dev](https://clerk.dev/).
    - Create a new application in your Clerk dashboard.
    - Obtain your Publishable Key and Secret Key.
    - Add these keys as environment variables in your Convex project settings (Dashboard -> Settings -> Environment Variables). The required variables are `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
    - Update your frontend to use the Publishable Key. This is usually done in your main application file (e.g., `main.tsx` or `App.tsx`) where you configure the `<ClerkProvider>`.

      ```tsx
      // Example for src/main.tsx
      // ...
      const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

      if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Publishable Key");
      }

      ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            {/* ... your app ... */}
          </ClerkProvider>
        </React.StrictMode>
      );
      ```

    - Ensure your `.env.local` (or similar for Vite) has `VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key`.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This command typically starts both the frontend (Vite) and the Convex backend development server.

## Available Scripts

- `npm run dev`: Starts the development server for both frontend (Vite with --open) and backend (Convex). It also runs `convex dev --once` and `node setup.mjs` initially.
- `npm run dev:frontend`: Starts the Vite development server for the frontend.
- `npm run dev:backend`: Starts the Convex development server.
- `npm run lint`: Lints the TypeScript code for both Convex functions and the frontend, then runs `vite build`.
- `npm run build`: Builds the frontend application for production using Vite.

## Contributing

(Details on how to contribute to the project, coding standards, pull request process, etc. - Placeholder for now)

## License

(Specify the license for the project - Placeholder for now, e.g., MIT License)
