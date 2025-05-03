import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { Routes, Route, Link, Navigate, useLocation, Outlet } from "react-router-dom";
import { DashboardView } from "./pages/DashboardView";
import { JobsView } from "./pages/JobsView";
import { ApplicationsView } from "./pages/ApplicationsView";
import { ProfileView } from "./pages/ProfileView";
import JobEditor from "./pages/JobEditor";
import AtsAnalysisView from "./pages/AtsAnalysisView"; // Import the new ATS analysis view
import SignInAnimation from "@/lotties/SignInAnimation.json";
import Lottie from "react-lottie";
import Navbar from "./components/Dashboard/Navbar";



function App() {
  const profile = useQuery(api.users.getProfile);
  const isAdmin = useQuery(api.users.isAdmin);
  const location = useLocation();

  const SignInAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: SignInAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <Authenticated>
        <Navbar />
      </Authenticated>

      <main className={`flex-1 ${location.pathname==="/dashboard" ? "": ""}`}>
        <div className={`${location.pathname==="/dashboard" ? "":"mx-auto"}`}>
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
                <Route path="/ats-analysis" element={<AtsAnalysisView />}/>
                <Route path="/job-editor" element={<JobEditor/>}/>
                <Route path="/jobs" element={<JobsView isAdmin={isAdmin ?? false} />} />
                <Route path="/applications" element={<ApplicationsView isAdmin={isAdmin ?? false} />} />
                <Route path="/profile" element={profile && <ProfileView profile={{email:"", phone:"", ...profile}} />} />
                <Route path="/ats-analysis" element={<AtsAnalysisView />} /> {/* Add route for ATS Analysis */}
                {/* Default route redirects to /jobs */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Optional: Add a 404 or catch-all route here */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </Authenticated>
          <Unauthenticated>
            {/* Unauthenticated users see the sign-in form */}
            {/*<div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Campus Placement Hub</h1>
                <p className="text-gray-600">Sign in to access job postings and manage your applications.</p>
              </div>
              <SignInForm />
            </div> */}
            <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-r from-blue-400 to-emerald-400">
              
              <div className="flex flex-col gap-4 ">
                {/* <div className="flex justify-center gap-2 md:justify-start">
                  <a href="#" className="flex items-center gap-2 font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                      <GalleryVerticalEnd className="h-4 w-4" />
                    </div>
                    
                  </a>
                </div> */}
                <div className="">
                  <div className="">
                    <div className="text-center">
                    </div>
                    <SignInForm />
                  </div>
                </div>
              </div>
              <div className="relative hidden  flex items-center lg:block">
              <Lottie
                options={SignInAnimationOptions}
                
                style={{height: "70%", width: "100%"}}
              />
                <div className="absolute inset-0  flex flex-col justify-end p-12 text-white">
                  <h2 className="text-2xl font-bold mb-2">Launch your career journey with <span className="text-4xl" >
                  Campus Commune .</span></h2>
                  <p className="text-lg">Connect with top employers and find opportunities that match your skills and ambitions.</p>
                </div>
              </div>
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
            {/* <option value="admin">Admin</option> */}
            <option value="pr">PR</option>
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

export default App;

