import SearchInput from "@/components/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BriefcaseIcon,
  MailOpenIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  Building2Icon,
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClipboardListIcon,
  ArchiveIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { Doc, Id } from "convex/_generated/dataModel";
import Lottie from "react-lottie";
import applicationLottie from "@/lotties/check-animated.json";

// Define the combined type for application with job details
type ApplicationWithJob = Doc<"applications"> & { job: Doc<"jobs"> | null };

// Update component props to include renderUpdateButton callback
const Applications = ({
  applications,
  onSelectApplication,
  renderUpdateButton,
}: {
  applications: ApplicationWithJob[];
  onSelectApplication?: (application: ApplicationWithJob | undefined) => void;
  renderUpdateButton?: (jobId: Id<"jobs">) => React.ReactNode;
}) => {
  // Update state type
  const [selectedApp, setSelectedApp] = useState<
    ApplicationWithJob | undefined
  >();
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<"Active" | "Archived">("Active");
  // Add search state
  const [searchTerm, setSearchTerm] = useState("");

  // Animation options
  const applicationAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: applicationLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Function to handle application selection
  const handleSelectApp = (application: ApplicationWithJob) => {
    setSelectedApp(application);
    if (onSelectApplication) {
      onSelectApplication(application);
    }
  };

  // Filter applications based on active tab and search term
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      searchTerm === "" ||
      (application.job?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      (application.job?.company
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
      application.status.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, all applications are treated as "Active" since we don't have an archived status
    const matchesTab = activeTab === "Active";

    return matchesSearch && matchesTab;
  });

  // Helper function to get status badge style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CheckCircleIcon className="w-3 h-3" />,
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <AlertCircleIcon className="w-3 h-3" />,
        };
      case "shortlisted":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <ClipboardListIcon className="w-3 h-3" />,
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <MailIcon className="w-3 h-3" />,
        };
    }
  };

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Blue header bar with text only */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 w-full">
        <div className="w-full px-6">
          <h1 className="text-2xl font-bold text-white">Your Applications</h1>
        </div>
      </div>

      <main className="flex-grow w-full px-0 py-0">
        <Card className="bg-white border-0 rounded-none shadow-none">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Sidebar */}
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeTab === "Active" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("Active")}
                >
                  <MailIcon className="w-4 h-4" />
                  Active
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${activeTab === "Archived" ? "bg-indigo-100 text-indigo-700 font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("Archived")}
                >
                  <ArchiveIcon className="w-4 h-4" />
                  Archived
                </Button>

                <Separator className="my-5" />

                <div className="space-y-5">
                  <h3 className="text-sm font-medium text-gray-600">
                    Application Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Shortlisted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Accepted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Applications List */}
              <div className="lg:col-span-4">
                <div className="mb-6">
                  <SearchInput
                    placeholder="Search applications..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">
                    {filteredApplications.length} Applications
                  </h2>
                  <span className="text-sm text-gray-500">
                    {activeTab} Applications
                  </span>
                </div>

                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-3 pr-4">
                    {filteredApplications.length === 0 ? (
                      <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-gray-500">No applications found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    ) : (
                      filteredApplications.map((application) => {
                        const statusStyle = getStatusStyle(application.status);
                        return (
                          <Card
                            key={application._id}
                            className={`bg-white mt-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-l-4 ${
                              selectedApp?._id === application._id
                                ? "border-l-indigo-600"
                                : "border-l-transparent"
                            }`}
                            onClick={() => handleSelectApp(application)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                                    {application.job?.title ??
                                      "Job Title Unavailable"}
                                  </h3>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Building2Icon className="w-3.5 h-3.5" />
                                    {application.job?.company ??
                                      "Company Unavailable"}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                                >
                                  {statusStyle.icon}
                                  {application.status}
                                </span>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-3.5 h-3.5" />
                                  Applied on{" "}
                                  {formatDate(application._creationTime)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-6">
                {selectedApp ? (
                  <Card className="h-[calc(100vh-180px)] overflow-auto bg-white rounded-none shadow-none border-0">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            {selectedApp.job?.title ?? "Job Title Unavailable"}
                          </h2>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Building2Icon className="w-4 h-4" />
                            <span>
                              {selectedApp.job?.company ??
                                "Company Unavailable"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Updates button moved to status section */}
                          {renderUpdateButton &&
                            selectedApp.job &&
                            renderUpdateButton(selectedApp.job._id)}

                          {selectedApp.status && (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedApp.status).bg} ${getStatusStyle(selectedApp.status).text}`}
                            >
                              {getStatusStyle(selectedApp.status).icon}
                              {selectedApp.status}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedApp(undefined);
                              if (onSelectApplication)
                                onSelectApplication(undefined);
                            }}
                            className="rounded-full hover:bg-gray-100"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="bg-gray-50 border-0 shadow-sm">
                          <CardContent className="p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                              Application Details
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <CalendarIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Applied On
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatDate(selectedApp._creationTime)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <UserIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Job Type
                                  </p>
                                  <p className="text-sm font-medium capitalize">
                                    {selectedApp.job?.type ?? "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPinIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Location
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedApp.job?.location ?? "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-50 border-0 shadow-sm">
                          <CardContent className="p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                              Status Timeline
                            </h3>
                            <div className="relative pl-6 space-y-6">
                              <div className="relative">
                                <div className="absolute left-[-1.5rem] top-1 w-4 h-4 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Application Submitted
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(selectedApp._creationTime)}
                                  </p>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="absolute left-[-1.5rem] top-1 w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Under Review
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Waiting for employer response
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="bg-gray-50 border-0 shadow-sm mb-6">
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Job Description
                          </h3>
                          <div className="text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
                            {selectedApp.job?.description ??
                              "Job description not available."}
                          </div>
                        </CardContent>
                      </Card>

                      {selectedApp.job?.skills &&
                        selectedApp.job.skills.length > 0 && (
                          <Card className="bg-gray-50 border-0 shadow-sm mb-6">
                            <CardContent className="p-4">
                              <h3 className="text-sm font-medium text-gray-500 mb-3">
                                Required Skills
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedApp.job.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                      <div className="flex gap-3 justify-between items-center">
                        <Button
                          variant="outline"
                          className="text-sm"
                          onClick={() => {
                            setSelectedApp(undefined);
                            if (onSelectApplication)
                              onSelectApplication(undefined);
                          }}
                        >
                          Back to Applications
                        </Button>

                        <Button variant="gradient" className="text-sm">
                          Contact Employer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center bg-white rounded-none border-0 p-6">
                    <div className="w-20 h-20 mb-4 text-gray-300">
                      <MailOpenIcon className="w-20 h-20" strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Application Selected
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Select an application from the list to view its details,
                      status, and job information
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Applications;
