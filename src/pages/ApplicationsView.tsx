import { useState } from "react";
import { useQuery } from "convex/react";
import Applications from "./../components/Applications/Applications";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Doc, Id } from "../../convex/_generated/dataModel";
import {
  BellRingIcon,
  CalendarIcon,
  ClockIcon,
  MegaphoneIcon,
  BuildingIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Define a type for job updates
type JobUpdate = Doc<"jobUpdates"> & {
  mail?: Doc<"mails"> | null;
};

export function ApplicationsView({ isAdmin }: { isAdmin: boolean }) {
  // Fetch applications WITH job details using the appropriate query
  const applicationsWithJobs = useQuery(api.applications.listByStudent) ?? [];

  // State to track the selected job ID to fetch updates for
  const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(null);

  // State to control the updates dialog
  const [showUpdates, setShowUpdates] = useState(false);

  // Fetch all job updates in one query
  const allJobUpdates = useQuery(api.jobUpdates.getAllJobUpdates) ?? [];

  // Create a map of job ID to update count for efficient lookup
  const jobUpdateCountMap = allJobUpdates.reduce(
    (acc, update) => {
      const jobId = update.jobId;
      acc[jobId] = (acc[jobId] || 0) + 1;
      return acc;
    },
    {} as Record<Id<"jobs">, number>
  );

  // Fetch job updates for the selected job
  const jobUpdates =
    useQuery(
      api.jobUpdates.getUpdatesForJob,
      selectedJobId ? { jobId: selectedJobId } : "skip"
    ) ?? [];

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get the selected application object
  const selectedApplication = applicationsWithJobs.find(
    (app) => app.jobId === selectedJobId
  );

  const handleRenderUpdateButton = (jobId: Id<"jobs">) => {
    const updateCount = jobUpdateCountMap[jobId] || 0;

    if (updateCount > 0) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-600 flex items-center gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedJobId(jobId);
            setShowUpdates(true);
          }}
        >
          <MegaphoneIcon className="h-3.5 w-3.5" />
          <span>
            {updateCount} Update{updateCount > 1 ? "s" : ""}
          </span>
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue header bar with text only - consistent with other pages */}
      {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 w-full mb-4">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-white">Your Applications</h1>
        </div>
      </div> */}

      <div className=" mx-auto px-8 mb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Applications Component - Takes 12 columns */}
          <div className="col-span-12">
            <Applications
              applications={applicationsWithJobs}
              onSelectApplication={(application) => {
                setSelectedJobId(application?.jobId || null);
              }}
              renderUpdateButton={handleRenderUpdateButton}
            />
          </div>
        </div>
      </div>

      {/* Job Updates Dialog - Styled to match the screenshot */}
      <Dialog open={showUpdates} onOpenChange={setShowUpdates}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-0 shadow-lg bg-transparent">
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MegaphoneIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">
                    Job Updates and Announcements
                  </h2>
                </div>
                {selectedApplication?.job && (
                  <div className="flex items-center mt-1 text-sm opacity-90">
                    <BuildingIcon className="h-3.5 w-3.5 mr-1" />
                    <span>{selectedApplication.job.company ?? "Company"}</span>
                  </div>
                )}
              </div>
              <Badge
                className="bg-white/10 hover:bg-white/20 text-white border-0"
                variant="outline"
              >
                {selectedApplication?.job?.title
                  ? selectedApplication.job.title
                  : "Active Applications"}
              </Badge>
            </div>

            {/* Content Area */}
            <div className="bg-white p-0">
              <div className="grid grid-cols-1 md:grid-cols-1">
                <div className="bg-white">
                  <ScrollArea className="h-[60vh]">
                    {jobUpdates.length > 0 ? (
                      <div className="p-6 space-y-6">
                        {jobUpdates.map((update) => (
                          <div
                            key={update._id}
                            className="border-b bg-gray-100 p-4 rounded-xl border-gray-100 pb-6 last:pb-2 last:border-0"
                          >
                            <div className="flex items-center gap-4 mb-2">
                              <div className="bg-purple-100 p-2 rounded-full">
                                <BellRingIcon className="h-5 w-5 text-purple-700" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  Process Update
                                </h3>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {formatDate(update._creationTime)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 pl-14">
                              <p className="text-gray-600 whitespace-pre-wrap">
                                {update.summary || "No details provided."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 text-gray-500">
                        <ClockIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p>No updates available for this job</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Check back later for announcements
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
              <Button
                variant="outline"
                className="text-sm flex items-center gap-1"
                onClick={() => setShowUpdates(false)}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Applications
              </Button>

              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 gap-1 flex items-center"
                >
                  <MegaphoneIcon className="h-3.5 w-3.5" />
                  {(selectedJobId && jobUpdateCountMap[selectedJobId]) ||
                    0}{" "}
                  Updates
                </Badge>

                <Button
                  variant="default"
                  className="bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Contact Employer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
