import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { Id } from "../convex/_generated/dataModel";
import { JobCard } from "./components/JobCard";
import { JobDetailsDialog } from "./components/JobDetailsDialog";
import { ApplicationCard } from "./components/ApplicationCard";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [view, setView] = useState<"jobs" | "applications" | "profile">("jobs");
  const profile = useQuery(api.users.getProfile);
  const isAdmin = useQuery(api.users.isAdmin);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Campus Placement Hub</h2>
        <div className="flex items-center gap-4">
          <Authenticated>
            <nav className="flex gap-4">
              <button
                onClick={() => setView("jobs")}
                className={`px-3 py-1 rounded-md ${
                  view === "jobs" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setView("applications")}
                className={`px-3 py-1 rounded-md ${
                  view === "applications" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setView("profile")}
                className={`px-3 py-1 rounded-md ${
                  view === "profile" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </button>
            </nav>
          </Authenticated>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Authenticated>
            {!profile ? (
              <CreateProfile />
            ) : view === "jobs" ? (
              <JobsView isAdmin={isAdmin ?? false} />
            ) : view === "applications" ? (
              <ApplicationsView isAdmin={isAdmin ?? false} />
            ) : (
              <ProfileView profile={profile} />
            )}
          </Authenticated>
          <Unauthenticated>
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

function JobsView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);

  // If not admin, show the dashboard view with categories and featured jobs
  if (!isAdmin) {
    return <Dashboard />;
  }

  // Admin view with job management
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <button
          onClick={() => setSelectedJob(null)}
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
      {selectedJob && <JobDetailsDialog jobId={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}

function ApplicationsView({ isAdmin }: { isAdmin: boolean }) {
  const applications = useQuery(api.applications.listByStudent) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Manage Applications" : "Your Applications"}
      </h1>
      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard key={application._id} application={application} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}

function ProfileView({ profile }: { profile: any }) {
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
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
