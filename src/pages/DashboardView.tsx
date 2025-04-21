import { CTA } from "@/components/Dashboard/CTA";
import FeaturedJobs from "@/components/Dashboard/FeaturedJobs";
import Footer from "@/components/Dashboard/Footer";
import HeroSection from "@/components/Dashboard/HeroSection";
import HowItWorks from "@/components/Dashboard/HowItWorks";
import JobCategories from "@/components/Dashboard/JobCategories";
import StatsSection from "@/components/Dashboard/StatsSection";
import Testimonials from "@/components/Dashboard/Testimonials";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useState } from "react";

export function DashboardView({ isAdmin }: { isAdmin: boolean }) {
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