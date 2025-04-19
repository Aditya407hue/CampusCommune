import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
// Remove useState for view
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { Id } from "../convex/_generated/dataModel";
import { JobCard } from "./components/JobCard";
import { JobDetailsDialog } from "./components/JobDetailsDialog";
import { ApplicationCard } from "./components/ApplicationCard";
// Import routing components
import { Routes, Route, Link, Navigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react"; // Keep useState for selectedJob
import Navbar from "./components/Dashboard/Navbar";
import HeroSection from "./components/Dashboard/HeroSection";
import StatsSection from "./components/Dashboard/StatsSection";
import HowItWorks from "./components/Dashboard/HowItWorks";
import FeaturedJobs from "./components/Dashboard/FeaturedJobs";
import JobCategories from "./components/Dashboard/JobCategories";
import Testimonials from "./components/Dashboard/Testimonials";
import { CTA } from "./components/Dashboard/CTA";
import Footer from "./components/Dashboard/Footer";
import { cn } from "./lib/utils";

function App() {
  // Remove view state: const [view, setView] = useState<"jobs" | "applications" | "profile">("jobs");
  const profile = useQuery(api.users.getProfile);
  const isAdmin = useQuery(api.users.isAdmin);
  const location = useLocation(); // Get current location for active link styling
  // console.log(profile);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Campus Placement Hub</h2>
        <div className="flex items-center gap-4">
          <Authenticated>
            <nav className="flex gap-4">
              {/* Use Link components for navigation */}
              <Link
                to="/dashboard"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/dashboard" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/jobs" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Jobs
              </Link>
              <Link
                to="/applications"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/applications" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Applications
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/profile" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </Link>
            </nav>
          </Authenticated>
          <SignOutButton />
        </div>
      </header>
      <main className={`flex-1 ${location.pathname==="/dashboard" ? "": "p-8"}`}>
        <div className={`${location.pathname==="/dashboard" ? "":"max-w-7xl mx-auto"}`}>
          <Authenticated>
            {/* Conditional rendering based on profile existence */}
            {profile===null ? (
              <Routes>
                <Route path="/create-profile" element={<CreateProfile />} />
                {/* Redirect any other authenticated path to create-profile if profile doesn't exist */}
                <Route path="*" element={<Navigate to="/create-profile" replace />} />
              </Routes>
            ) : (
              // Define routes for authenticated users with profiles
              <Routes>
                <Route path="/dashboard" element={<DashboardView isAdmin={isAdmin ?? false}/>}/>
                <Route path="/jobs" element={<JobsView isAdmin={isAdmin ?? false} />} />
                <Route path="/applications" element={<ApplicationsView isAdmin={isAdmin ?? false} />} />
                <Route path="/profile" element={<ProfileView profile={profile} />} />
                {/* Default route redirects to /jobs */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Optional: Add a 404 or catch-all route here */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </Authenticated>
          <Unauthenticated>
            {/* Unauthenticated users see the sign-in form */}
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Campus Placement Hub</h1>
                <p className="text-gray-600">Sign in to access job postings and manage your applications.</p>
              </div>
              <SignInForm />
            </div>
          </Unauthenticated>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function CreateProfile() {
  const createProfile = useMutation(api.users.createProfile);
  const form = useForm({
    defaultValues: {
      name: "",
      role: "student" as const,
      department: "",
      graduationYear: new Date().getFullYear() + 4,
      skills: [] as string[],
    },
  });

  const onSubmit = form.handleSubmit(async (data: {
    name: string;
    role: "student" | "admin";
    department: string;
    graduationYear: number;
    skills: string[];
  }) => {
    try {
      await createProfile(data);
      toast.success("Profile created successfully!");
      // No need to navigate here, the parent component will re-render with the profile
    } catch (error) {
      toast.error("Failed to create profile");
    }
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Please provide your details to continue.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...form.register("name", { required: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            {...form.register("role")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            {...form.register("department", { required: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
          <input
            type="number"
            {...form.register("graduationYear", { required: true, valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            onChange={(e) => form.setValue("skills", e.target.value.split(",").map(s => s.trim()))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}


function DashboardView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);

  

  // Admin view with job management
  // return (
  //   <div>
  //     <div className="flex justify-between items-center mb-6">
  //       <h1 className="text-2xl font-bold">Manage Jobs</h1>
  //       <button
  //         // Consider making the "Post New Job" open a modal or navigate to a specific route e.g., /jobs/new
  //         onClick={() => setSelectedJob(null)} // This logic might change if using a route for creation/editing
  //         className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
  //       >
  //         Post New Job
  //       </button>
  //     </div>
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {jobs.map((job) => (
  //         <JobCard key={job._id} job={job} onClick={() => setSelectedJob(job._id)} />
  //       ))}
  //     </div>
  //     {/* This dialog logic remains the same for now */}
  //     {selectedJob && <JobDetailsDialog jobId={selectedJob} onClose={() => setSelectedJob(null)} />}
  //     {/* If you want job details on a separate page, you'd use a nested route like /jobs/:jobId */}
  //     {/* {!selectedJob && <PostJobForm onClose={() => {}} />}  Example if Post New Job opens a form */}

  //   </div>
  // );

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FeaturedJobs />
        <JobCategories />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function JobsView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);

  // Admin view with job management
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <button
          // Consider making the "Post New Job" open a modal or navigate to a specific route e.g., /jobs/new
          onClick={() => setSelectedJob(null)} // This logic might change if using a route for creation/editing
          className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
        >
          Post New Job
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onClick={() => setSelectedJob(job._id)} />
        ))}
      </div>
      {/* This dialog logic remains the same for now */}
      {selectedJob && <JobDetailsDialog jobId={selectedJob} onClose={() => setSelectedJob(null)} />}
      {/* If you want job details on a separate page, you'd use a nested route like /jobs/:jobId */}
      {/* {!selectedJob && <PostJobForm onClose={() => {}} />}  Example if Post New Job opens a form */}

    </div>
  );
}

function ApplicationsView({ isAdmin }: { isAdmin: boolean }) {
  // Fetching logic might need adjustment based on admin/student view if they differ significantly
  const applications = useQuery(api.applications.listByStudent) ?? []; // Assuming this works for both or you have separate queries

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Manage Applications" : "Your Applications"}
      </h1>
      <div className="space-y-4">
        {applications.length === 0 && <p className="text-gray-500">No applications found.</p>}
        {applications.map((application) => (
          <ApplicationCard key={application._id} application={application} isAdmin={isAdmin} />
        ))}
      </div>
      {/* If viewing specific application details is needed, consider a route like /applications/:applicationId */}
    </div>
  );
}

function ProfileView({ profile }: { profile: any }) {
  // This component remains the same as it just displays data
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 capitalize">{profile.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Department</label>
            <p className="mt-1">{profile.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Graduation Year</label>
            <p className="mt-1">{profile.graduationYear}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500">Skills</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                 profile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills listed.</p>
              )}
            </div>
          </div>
        </div>
        {/* Add an Edit Profile button here that could navigate to /profile/edit */}
      </div>
    </div>
  );
}


export default App;
