import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { DashboardView } from "./pages/DashboardView";
import { JobsView } from "./pages/JobsView";
import { ApplicationsView } from "./pages/ApplicationsView";
import { ProfileView } from "./pages/ProfileView";
import JobEditor from "./pages/JobEditor";
import AtsAnalysisView from "./pages/AtsAnalysisView"; // Import the new ATS analysis view

function App() {
  const profile = useQuery(api.users.getProfile);
  const isAdmin = useQuery(api.users.isAdmin);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">
          Campus Commune
        </h2>
        <div className="flex items-center gap-4">
          <Authenticated>
            <nav className="flex gap-4">
              {/* Use Link components for navigation */}
              <Link
                to="/dashboard"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/dashboard"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/jobs"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Jobs
              </Link>
              <Link
                to="/applications"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/applications"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Applications
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1 rounded-md ${
                  location.pathname === "/profile"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </Link>
            </nav>
          </Authenticated>
          <SignOutButton />
        </div>
      </header>
      <main
        className={`flex-1 ${location.pathname === "/dashboard" ? "" : "p-8"}`}
      >
        <div
          className={`${location.pathname === "/applications" ? "px-10" : ""}`}
        >
          <Authenticated>
            {/* Conditional rendering based on profile existence */}
            {profile === null ? (
              <Routes>
                <Route path="/create-profile" element={<CreateProfile />} />
                {/* Redirect any other authenticated path to create-profile if profile doesn't exist */}
                <Route
                  path="*"
                  element={<Navigate to="/create-profile" replace />}
                />
              </Routes>
            ) : (
              // Define routes for authenticated users with profiles
              <Routes>
                <Route
                  path="/dashboard"
                  element={<DashboardView isAdmin={isAdmin ?? false} />}
                />
                <Route path="/job-editor" element={<JobEditor />} />
                <Route
                  path="/jobs"
                  element={<JobsView isAdmin={isAdmin ?? false} />}
                />
                <Route
                  path="/applications"
                  element={<ApplicationsView isAdmin={isAdmin ?? false} />}
                />
                <Route
                  path="/profile"
                  element={
                    profile && (
                      <ProfileView
                        profile={{ email: "", phone: "", ...profile }}
                      />
                    )
                  }
                />
                <Route path="/ats-analysis" element={<AtsAnalysisView />} />{" "}
                {/* Add route for ATS Analysis */}
                {/* Default route redirects to /jobs */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                {/* Optional: Add a 404 or catch-all route here */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            )}
          </Authenticated>
          <Unauthenticated>
            {/* Unauthenticated users see the sign-in form */}
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to Campus Placement Hub
                </h1>
                <p className="text-gray-600">
                  Sign in to access job postings and manage your applications.
                </p>
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

  const onSubmit = form.handleSubmit(
    async (data: {
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
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">
          Please provide your details to continue.
        </p>
      </div>
      <form onSubmit={void onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...form.register("name", { required: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...form.register("role")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            {...form.register("department", { required: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Graduation Year
          </label>
          <input
            type="number"
            {...form.register("graduationYear", {
              required: true,
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            onChange={(e) =>
              form.setValue(
                "skills",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
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

export default App;
