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
import { useState } from "react"; // Keep useState for selectedJob and add for filters/search
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
import { Button } from "./components/ui/button";
import { BanknoteIcon, BriefcaseIcon, ClockIcon, ListCheckIcon, MapPinIcon, TagIcon } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import SearchInput, { PlaceholdersAndVanishInputDemo } from "./components/SearchInput";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState("");
  // Replace activeFilters state with filterValues state
  const [filterValues, setFilterValues] = useState({
    category: "",
    location: "",
    salary: "",
    type: "all", // Default to 'all'
  });

  // Handler to update filter values
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
    // In a real app, you might trigger a refetch or client-side filter here
  };

  // Filter jobs based on searchTerm and filterValues (basic example)
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters = 
      (filterValues.location === "" || job.location.toLowerCase().includes(filterValues.location.toLowerCase())) &&
      (filterValues.salary === "" || job?.salary?.toString().includes(filterValues.salary)) && // Basic salary check
      (filterValues.type === "all" || job.type.toLowerCase() === filterValues.type.toLowerCase()) &&
      (filterValues.category === "" || job.skills.some(skill => skill.toLowerCase().includes(filterValues.category.toLowerCase()))); // Basic category check on skills

    return matchesSearch && matchesFilters;
  });

  // Admin view with job management (commented out)
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
    <>

    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Search Section - Improved Styling */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 mb-10 shadow-xl text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find Your <span className="text-yellow-300">Dream Job</span> Today
            </h1>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
              Browse through thousands of full-time and part-time jobs near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto justify-center items-center">
              {/* Use PlaceholdersAndVanishInputDemo for main search */}
              <PlaceholdersAndVanishInputDemo onChange={(value) => setSearchTerm(value)} />
              {/* Removed the separate Find Jobs button as search might be triggered by input */}
            </div>
          </div>

          {/* Filters Section - Replaced Buttons with Inputs/Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 items-end">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category/Skill</label>
              <Input
                id="category"
                name="category"
                placeholder="e.g., React, Design"
                value={filterValues.category}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Remote, City"
                value={filterValues.location}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <Input
                id="salary"
                name="salary"
                placeholder="e.g., 50000"
                value={filterValues.salary}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <Select
                name="type"
                value={filterValues.type}
                onValueChange={(value) => setFilterValues(prev => ({ ...prev, type: value }))} // Select uses onValueChange
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white"> {/* Added z-50 here */}
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Listings - Use filteredJobs */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No jobs match your current search or filters.</p>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job._id} className="transition-all hover:shadow-lg duration-200 cursor-pointer transform hover:-translate-y-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {/* Placeholder Icon - Replace with company logo if available */}
                        <BriefcaseIcon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex flex-col sm:flex-row sm:sm:items-center sm:justify-between">
                           <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors duration-200">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {job.type}
                            </span>
                            {/* Add other relevant badges like remote status if available */}
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <BriefcaseIcon className="w-4 h-4" />
                            {job.experience ?? 'N/A'} {/* Assuming experience might be a field */}
                          </span>
                          <span className="flex items-center gap-1">
                            <BanknoteIcon className="w-4 h-4" />
                            Rs. {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedJob(job._id)} // Open details dialog on click
                        className="md:self-center flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer px-4 py-2 rounded-lg text-sm font-medium mt-4 md:mt-0 w-full md:w-auto"
                      >
                        <ListCheckIcon className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
    </>
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

function ProfileView({ profile }: { profile: any }) { // Add ProfileView definition if missing or incomplete
  const updateProfile = useMutation(api.users.updateProfile);
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return <div>Loading profile...</div>; // Or some other loading state
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {isEditing ? (
        <EditProfileForm profile={profile} onSave={() => setIsEditing(false)} />
      ) : (
        <Card>
          <CardContent className="p-6 space-y-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Role:</strong> <span className="capitalize">{profile.role}</span></p>
            <p><strong>Department:</strong> {profile.department}</p>
            <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
            <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'N/A'}</p>
            {/* Add other profile details here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;

