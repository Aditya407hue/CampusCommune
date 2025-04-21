import SearchInput from "@/components/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BriefcaseIcon, MailOpenIcon, MailIcon, MapPinIcon, ClockIcon, Building2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel"; // Adjusted import path

// Define the combined type for application with job details
type ApplicationWithJob = Doc<"applications"> & { job: Doc<"jobs"> | null };

// Remove the unused local Application interface
// interface Application {
//   id: number;
//   title: string;
//   company: string;
//   location: string;
//   status: string;
//   type: string;
//   salary: string;
//   applied: string;
//   description: string;
// }

// Update component props to use the new type
const Applications = ({ applications }: { applications: ApplicationWithJob[] }) => {
  // Update state type
  const [selectedApp, setSelectedApp] = useState<ApplicationWithJob | undefined>();
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'Active' | 'Archived'>('Active');

  // Commented out dummy data remains commented
  //   const applications: Application[] = [
  //     ...
  //   ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8f9]">
      <main className="flex-grow">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
            {/* Left Sidebar */}
            <div className="lg:col-span-2 space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${activeTab === 'Active' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground hover:bg-gray-100'}`}
                onClick={() => setActiveTab('Active')}
              >
                <MailIcon className="w-4 h-4" />
                Active
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${activeTab === 'Archived' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-muted-foreground hover:bg-gray-100'}`}
                onClick={() => setActiveTab('Archived')}
              >
                <MailOpenIcon className="w-4 h-4" />
                Archived
              </Button>
              <Separator className="my-4" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <SearchInput placeholder="Search applications..." className="w-full" />
              </div>

              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className=" mt-2 space-y-2">
                  {applications.map((application) => (
                    <Card
                      key={application._id}
                      // Apply Dashboard-like hover effects and shadow, use ring for selection
                      className={`bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1 ${selectedApp?._id === application._id ? 'border-2' : 'border' // Use ring for selection highlight
                        }`}
                      onClick={() => setSelectedApp(application)}
                    >
                      <CardContent className="p-0"> {/* Adjust padding if needed after outer padding is added */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            {/* Access job details safely */}
                            <h3 className="text-lg font-semibold mb-1 truncate">{application.job?.title ?? "Job Title Unavailable"}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{application.job?.company ?? "Company Unavailable"}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BriefcaseIcon className="w-4 h-4" />
                                {/* Format creation time as applied date */}
                                Applied on {new Date(application._creationTime).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MailOpenIcon className="w-4 h-4" />
                                {/* Access application status */}
                                {application.status}
                              </span>
                            </div>
                          </div>
                          {/* Style button similar to Dashboard primary buttons */}
                          <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-5">
              {selectedApp ? (
                // Apply Dashboard-like card styling (shadow and padding)
                <Card className="sticky top-4 bg-white rounded-lg shadow p-6">
                  <CardContent className="p-0"> {/* Adjust padding if needed after outer padding is added */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {/* Access job details safely */}
                        <h2 className="text-2xl font-bold mb-2">{selectedApp.job?.title ?? "Job Title Unavailable"}</h2>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Building2Icon className="w-4 h-4" />
                          {selectedApp.job?.company ?? "Company Unavailable"}
                        </p>
                      </div>
                      {/* Pass null to clear selection and add cursor-pointer */}
                      <Button variant="ghost" size="icon" onClick={() => setSelectedApp(undefined)} className="cursor-pointer hover:bg-gray-100">
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4" />
                          {/* Access job details safely */}
                          {selectedApp.job?.location ?? "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Job Type</p>
                        <p className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          {/* Access job details safely */}
                          {selectedApp.job?.type ?? "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Application Status</p>
                        <p className="flex items-center gap-2">
                          <MailOpenIcon className="w-4 h-4" />
                          {/* Access application status */}
                          {selectedApp.status}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Applied Date</p>
                        <p className="flex items-center gap-2">
                          <BriefcaseIcon className="w-4 h-4" />
                          {/* Format creation time as applied date */}
                          {new Date(selectedApp._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Job Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {/* Access job details safely */}
                        {selectedApp.job?.description ?? "Description not available."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg border border-dashed p-6">
                  Select an application to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Applications;