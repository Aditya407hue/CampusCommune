import { PlaceholdersAndVanishInputDemo } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { BanknoteIcon, BriefcaseIcon, ListCheckIcon, MapPinIcon } from "lucide-react";

import { useState } from "react";

export function JobsView({ isAdmin }: { isAdmin: boolean }) {
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
                <PlaceholdersAndVanishInputDemo />
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