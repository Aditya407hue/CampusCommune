import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useMutation,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardView } from "./pages/DashboardView";
import { JobsView } from "./pages/JobsView";
import { ApplicationsView } from "./pages/ApplicationsView";
import { ProfileView } from "./pages/ProfileView";
import JobEditor from "./pages/JobEditor";
import AtsAnalysisView from "./pages/AtsAnalysisView";
import Navbar from "./components/Dashboard/Navbar";

function App() {
  const profile = useQuery(api.users.getProfile);
  const isAdmin = useQuery(api.users.isAdmin);
  const location = useLocation();

  // Function to render routes based on user role
  const renderRoutes = () => {
    if (profile === null) {
      return (
        <Routes>
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="*" element={<Navigate to="/create-profile" replace />} />
        </Routes>
      );
    }

    // PR user specific routes
    if (profile && profile.role === "pr") {
      return (
        <Routes>
          <Route path="/jobs/new" element={<JobEditor />} />
          <Route path="/jobs" element={<JobEditor />} />{" "}
          {/* PR users see JobEditor as their main page */}
          <Route
            path="/profile"
            element={
              <ProfileView profile={{ email: "", phone: "", ...profile }} />
            }
          />
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      );
    }

    // Regular user routes (student/admin)
    return (
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardView isAdmin={isAdmin ?? false} />}
        />
        {isAdmin && <Route path="/jobs/new" element={<JobEditor />} />}{" "}
        {/* Only admins can access JobEditor */}
        <Route path="/jobs" element={<JobsView isAdmin={isAdmin ?? false} />} />
        <Route
          path="/applications"
          element={<ApplicationsView isAdmin={isAdmin ?? false} />}
        />
        <Route
          path="/profile"
          element={
            profile && (
              <ProfileView profile={{ email: "", phone: "", ...profile }} />
            )
          }
        />
        <Route path="/ats-analysis" element={<AtsAnalysisView />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Authenticated>
        <Navbar />
      </Authenticated>

      <main
        className={`flex-1 ${location.pathname === "/dashboard" ? "" : "p-8"}`}
      >
        <div
          className={`${location.pathname === "/applications" ? "px-10" : ""}`}
        >
          <Authenticated>{renderRoutes()}</Authenticated>
          <Unauthenticated>
            {/* <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to Campus Placement Hub
                </h1>
                <p className="text-gray-600">
                  Sign in to access job postings and manage your applications.
                </p>
              </div> */}
            <SignInForm />
            {/* <SignInButton /> */}
            {/* </div> */}
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
      role: "student" | "admin" | "pr";
      department: string;
      graduationYear: number;
      skills: string[];
    }) => {
      try {
        await createProfile(data);
        toast.success("Profile created successfully!");
      } catch (error) {
        console.error("Profile creation failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create profile"
        );
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
      <form onSubmit={onSubmit} className="space-y-4">
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
            <option value="pr">PR</option>
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
