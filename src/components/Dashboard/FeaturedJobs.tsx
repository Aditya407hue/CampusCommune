import { useQuery } from "convex/react";
import { Button } from "../../components/ui/button";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { JobDetailsDialog } from "../JobDetailsDialog";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const FeaturedJobs = () => {
  const isAdmin = useQuery(api.users.isAdmin);
  const allJobs = (
    useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? []
  ).sort((a, b) => {
    const ta = new Date(a._creationTime).getTime();
    const tb = new Date(b._creationTime).getTime();
    return tb - ta;
  });

  const jobs = allJobs.slice(0, 3);
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);
  const navigate = useNavigate();

  // Get company logo color based on company name
  const getCompanyColor = (company: string = "") => {
    const colors = ["indigo", "blue", "purple", "emerald", "amber", "rose"];
    const hash = Array.from(company).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    return colors[hash % colors.length];
  };

  // Get badge color based on job type
  const getJobTypeBadgeColor = (jobType: string = "") => {
    switch (jobType) {
      case "full-time":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200";
      case "part-time":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "internship":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      case "trainee":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const formatDeadline = (deadline: string | null | undefined) => {
    if (!deadline) return "No deadline";

    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return deadline; // Return the original string if not a valid date
      }

      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return deadline;
    }
  };

  return (
    <section id="featured-jobs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
            <p className="text-gray-600">
              Explore job opportunities from top companies
            </p>
          </div>

          <Button
            onClick={() => void navigate("/jobs")}
            variant="outline"
            className="mt-4 md:mt-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2 group"
          >
            <span>Explore All Jobs</span>
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const companyColor = getCompanyColor(job.company?.toString());

            return (
              <Card
                key={job._id}
                onClick={() => setSelectedJob(job._id)}
                className="overflow-hidden bg-white hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 border-0 shadow-sm"
              >
                {/* Colored header strip */}
                <div className={`h-2 w-full bg-${companyColor}-500`}></div>

                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg bg-${companyColor}-100 flex items-center justify-center flex-shrink-0`}
                    >
                      <span
                        className={`text-${companyColor}-600 font-semibold text-lg`}
                      >
                        {(job.company?.toString() || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {job.title || "Untitled Position"}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <BuildingIcon className="h-4 w-4" />
                        <span>{job.company || "Unknown Company"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                    )}

                    {job.deadline && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>Apply by {formatDeadline(job.deadline)}</span>
                      </div>
                    )}

                    {job.salary &&
                      (job.salary.stipend ||
                        job.salary.postConfirmationCTC) && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            {job.salary.stipend &&
                              `Stipend: ${job.salary.stipend}`}
                            {job.salary.stipend &&
                              job.salary.postConfirmationCTC &&
                              " | "}
                            {job.salary.postConfirmationCTC &&
                              `CTC: ${job.salary.postConfirmationCTC}`}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.type && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getJobTypeBadgeColor(job.type)}`}
                      >
                        {job.type}
                      </span>
                    )}

                    {job.skills &&
                      job.skills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}

                    {job.skills && job.skills.length > 2 && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        +{job.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 mt-2"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedJob && (
        <JobDetailsDialog
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </section>
  );
};

export default FeaturedJobs;
