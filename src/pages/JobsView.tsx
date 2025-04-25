import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  BanknoteIcon,
  BriefcaseIcon,
  ListCheckIcon,
  MapPinIcon,
  FilterIcon,
  TagIcon,
} from "lucide-react";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import Lottie from "react-lottie";
import searchLottie from "@/lottiefiles/search-jobs.json";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function JobsView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = (useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? []).sort(
    (a, b) => {
      const ta = new Date(a._creationTime).getTime();
      const tb = new Date(b._creationTime).getTime();
      return tb - ta; // Sort by createdAt, most
    }
  );
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({
    category: "",
    location: "",
    type: "all",
  });

  // Lottie animation options
  const searchAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: searchLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Handler to update filter values
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter jobs based on searchTerm and filterValues
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (job.skills &&
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesFilters =
      (filterValues.location === "" ||
        (job.location
          ?.toLowerCase()
          .includes(filterValues.location.toLowerCase()) ??
          false)) &&
      (filterValues.type === "all" ||
        job.type?.toLowerCase() === filterValues.type.toLowerCase()) &&
      (filterValues.category === "" ||
        (job.skills &&
          job.skills.some((skill) =>
            skill.toLowerCase().includes(filterValues.category.toLowerCase())
          )));

    return matchesSearch && matchesFilters;
  });

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow bg-gray-50">
          {/* Hero Section with Gradient Background */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 rounded-2xl shadow-lg p-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Find Your{" "}
                    <span className="text-yellow-300">Perfect Job</span> Match
                  </h1>
                  <p className="text-indigo-100 mb-8 text-lg max-w-xl">
                    Browse through thousands of opportunities that align with
                    your skills, experience, and career goals.
                  </p>
                  <div className="max-w-xl">
                    <SearchInput
                      placeholder="Job title, keywords, or company..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-yellow-300"
                      showButton={true}
                      onSearch={() => console.log("Search clicked")}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                  <Lottie
                    options={searchAnimationOptions}
                    height={280}
                    width={280}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 -mt-6">
            {/* Filter Section - Styled Card */}
            <Card className="mb-8 shadow-md bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-700">
                  <FilterIcon className="h-5 w-5" />
                  <h2 className="font-semibold">Filter Jobs</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category/Skill
                    </label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="e.g., React, Design"
                      value={filterValues.category}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Remote, City"
                      value={filterValues.location}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Job Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "all",
                        "full-time",
                        "part-time",
                        "internship",
                        "trainee",
                      ].map((type) => (
                        <Button
                          key={type}
                          variant={
                            filterValues.type === type ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() =>
                            setFilterValues((prev) => ({ ...prev, type }))
                          }
                          className={`${
                            filterValues.type === type
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm"
                              : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200"
                          } capitalize`}
                        >
                          {type === "all" ? "All Types" : type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Counter */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h2>
              {filteredJobs.length > 0 && (
                <p className="text-sm text-gray-500">
                  Showing {Math.min(20, filteredJobs.length)} of{" "}
                  {filteredJobs.length} results
                </p>
              )}
            </div>

            {/* Job Listings */}
            <ScrollArea className="h-[calc(100vh-420px)]">
              <div className="space-y-5 pr-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🔎</div>
                    <p className="text-gray-500 text-lg mb-2">
                      No jobs match your current search or filters
                    </p>
                    <p className="text-gray-400">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card
                      key={job._id}
                      onClick={() => setSelectedJob(job._id)}
                      className="transition-all hover:shadow-xl duration-300 cursor-pointer transform hover:-translate-y-1 bg-white border-0 rounded-xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="h-16 w-16 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
                          </div>
                          <div className="flex-grow space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                {job.title ?? "Untitled Job"}
                              </h3>
                            </div>
                            <p className="text-gray-700 font-medium flex items-center">
                              <span className="text-indigo-600 mr-2">@</span>
                              {job.company ?? "Unknown Company"}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {job.salary &&
                                (job.salary.stipend ||
                                  job.salary.postConfirmationCTC) && (
                                  <span className="flex items-center gap-2">
                                    <BanknoteIcon className="w-4 h-4 text-green-500" />
                                    {job.salary.stipend &&
                                      `Stipend: ${job.salary.stipend}`}
                                    {job.salary.stipend &&
                                      job.salary.postConfirmationCTC &&
                                      " | "}
                                    {job.salary.postConfirmationCTC &&
                                      `CTC: ${job.salary.postConfirmationCTC}`}
                                  </span>
                                )}
                              {job.location && (
                                <span className="flex items-center gap-2">
                                  <MapPinIcon className="w-4 h-4 text-indigo-500" />
                                  {job.location}
                                </span>
                              )}
                              {job.deadline && (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 text-amber-500">
                                    📅
                                  </span>
                                  Deadline: {job.deadline}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 h-full">
                              {job.type && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                  {job.type}
                                </span>
                              )}
                              {job.skills && job.skills.length > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                  {job.skills.length} Skills
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="gradient"
                            className="md:self-center flex items-center gap-2 rounded-lg text-sm font-medium mt-4 md:mt-0 w-full md:w-auto"
                          >
                            <ListCheckIcon className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>

                        {/* Skills Section - Centered alignment */}
                        {/* {job.skills && job.skills.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-2 mb-3 text-xs text-gray-500">
                              <span className="font-medium">Skills</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                              {job.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center justify-center px-4 py-1.5 rounded-md text-xs font-medium bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors border border-gray-100 mx-1 my-1 min-w-[80px]"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )} */}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
      {/* Job Details Dialog */}
      {selectedJob && (
        <JobDetailsDialog
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}
