import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { JobCard } from "./JobCard";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { Id } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const jobs = useQuery(api.jobs.list, { onlyActive: true }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);

  // Group jobs by type for categories section
  const jobCategories = {
    "full-time": jobs.filter(job => job.type === "full-time"),
    "part-time": jobs.filter(job => job.type === "part-time"),
    "internship": jobs.filter(job => job.type === "internship"),
  };

  // Get featured jobs (first 3 jobs)
  const featuredJobs = jobs.slice(0, 3);

  // Get latest jobs (sorted by deadline, most recent first)
  const latestJobs = [...jobs].sort((a, b) => b.deadline - a.deadline).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-indigo-50 rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Explore hundreds of job opportunities and take the next step in your career journey.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 hover:scale-105 hover:shadow-md">
            Browse Jobs
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-100 transition-all duration-200 hover:scale-105 hover:shadow-sm">
            For Employers
          </button>
        </div>
      </section>

      {/* Job Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Job Categories</h2>
          <a href="#" className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 capitalize">Full-Time Jobs</h3>
            <p className="text-gray-600 mb-4">{jobCategories["full-time"].length} positions available</p>
            <a href="#" className="text-blue-600 hover:underline">Browse Jobs →</a>
          </div>
          <div className="bg-green-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 capitalize">Part-Time Jobs</h3>
            <p className="text-gray-600 mb-4">{jobCategories["part-time"].length} positions available</p>
            <a href="#" className="text-green-600 hover:underline">Browse Jobs →</a>
          </div>
          <div className="bg-amber-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 capitalize">Internships</h3>
            <p className="text-gray-600 mb-4">{jobCategories["internship"].length} positions available</p>
            <a href="#" className="text-amber-600 hover:underline">Browse Jobs →</a>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Jobs</h2>
          <a href="#" className="text-indigo-600 hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} onClick={() => setSelectedJob(job._id)} />
          ))}
        </div>
      </section>

      {/* Latest Job Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Job Posts</h2>
          <a href="#" className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1"
                 onClick={() => setSelectedJob(job._id)}>
              <h3 className="text-lg font-semibold mb-1 truncate">{job.title}</h3>
              <p className="text-gray-600 mb-2 text-sm">{job.company}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span>{job.location}</span>
                <span>•</span>
                <span className="capitalize">{job.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
                <button className="text-xs text-indigo-600 hover:underline hover:text-indigo-800 transition-colors">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruitment Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="md:flex justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Looking to Hire?</h2>
            <p className="max-w-xl opacity-90">
              Post your job openings and find the perfect candidates for your company.
              Our platform connects you with talented professionals across various fields.
            </p>
          </div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md">
            Post a Job
          </button>
        </div>
      </section>

      {/* Job Details Dialog */}
      {selectedJob && <JobDetailsDialog jobId={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}