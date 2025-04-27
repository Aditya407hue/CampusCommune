import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import {
  Building2Icon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  PaperclipIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { JobDetailsDialog } from "./JobDetailsDialog";

interface JobCardProps {
  jobId: Id<"jobs">;
}

export function JobCard({ jobId }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const job = useQuery(api.jobs.getById, { jobId });

  // Fetch mail data to get attachment links
  const mailData = useQuery(
    api.mails.getMailById,
    job?.mailId ? { mailId: job.mailId } : "skip"
  );

  const hasAttachments =
    mailData?.attachmentLinks && mailData.attachmentLinks.length > 0;

  if (!job) {
    return (
      <Card className="w-full bg-white rounded-lg overflow-hidden border border-gray-200 p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-100 rounded w-16"></div>
          <div className="h-6 bg-gray-100 rounded w-16"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all">
        <div className="p-5">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2Icon className="h-4 w-4 mr-1" />
              <span>{job.company}</span>
            </div>

            {/* Display badges in a flex container */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.type && (
                <Badge
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                >
                  <BriefcaseIcon className="h-3 w-3 mr-1" />
                  {job.type}
                </Badge>
              )}
              {job.location && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                >
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  {job.location}
                </Badge>
              )}
              {job.deadline && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Deadline: {job.deadline}
                </Badge>
              )}
              {hasAttachments && (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                >
                  <PaperclipIcon className="h-3 w-3 mr-1" />
                  Attachments
                </Badge>
              )}
            </div>

            {/* Description truncated */}
            {job.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>
            )}

            {/* Skills tags */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowDetails(true)}
              variant="ghost"
              className="mt-2 w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {showDetails && (
        <JobDetailsDialog jobId={jobId} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}
