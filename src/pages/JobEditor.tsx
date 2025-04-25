import { useState, useEffect, useMemo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Edit, View, FileText, Bell, Plus, Send } from "lucide-react";
import { TextViewer } from "@/components/JobEditor/TextViewer";
import { JobPostingForm } from "@/components/JobEditor/JobPostingForm";
import { JobUpdateForm } from "@/components/JobEditor/JobUpdateForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "convex/_generated/dataModel";

interface Mail {
  _id: Id<"mails">;
  _creationTime: number;
  subject: string;
  body: string;
}

const sampleText =
  "Welcome to the Job Editor!\n\nThis is a sample text that demonstrates how new lines work.\nYou can edit the JSON on the right side.\n\nThe editor supports:\n- View mode\n- Edit mode\n- JSON validation\n- Easy formatting";

// Initial data for new job posting with correct types
const initialJobData = {
  title: "",
  company: "",
  description: "",
  location: "",
  type: "full-time" as "full-time" | "part-time" | "internship" | "trainee",
  skills: [] as string[],
  salary: {
    stipend: "",
    postConfirmationCTC: "",
  },
  deadline: "",
  applicationLink: [] as string[],
  moreDetails: {
    eligibility: "",
    selectionProcess: [] as string[],
    serviceAgreement: "",
    training: "",
    joiningDate: "",
    requiredDocuments: "",
    companyWebsite: "",
  },
  mailId: "" as Id<"mails">,
};

// Initial data for job update with correct types
const initialJobUpdateData = {
  companyName: "",
  summary: "",
  mailId: "" as Id<"mails">,
};

const JOB_TYPES = {
  NEW_JOB: "new_job_posting",
  JOB_UPDATE: "job_update",
} as const;

const JobEditor = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [jobType, setJobType] = useState<string>(JOB_TYPES.NEW_JOB);
  const [jobData, setJobData] = useState(initialJobData);
  const [jobUpdateData, setJobUpdateData] = useState(initialJobUpdateData);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Memoize empty mails array to prevent unnecessary re-renders
  const mails = useMemo<Mail[]>(() => [], []);

  // Mutations for saving data
  const createJob = useMutation(api.jobs.create);
  const createJobUpdate = useMutation(api.jobUpdates.create);

  // Handle data changes based on job type
  const handleDataChange = (data: any) => {
    if (jobType === JOB_TYPES.NEW_JOB) {
      setJobData(data);
    } else {
      setJobUpdateData(data);
    }
  };

  // Set sample mail ID when mails are loaded
  useEffect(() => {
    if (mails.length > 0) {
      setJobData((prev) => ({ ...prev, mailId: mails[0]._id }));
      setJobUpdateData((prev) => ({ ...prev, mailId: mails[0]._id }));
    }
  }, [mails]);

  // Validate form data before saving
  const validateForm = () => {
    if (jobType === JOB_TYPES.NEW_JOB) {
      // Basic validation for job posting
      if (!jobData.title) {
        toast({
          title: "Validation error",
          description: "Job title is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobData.company) {
        toast({
          title: "Validation error",
          description: "Company name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobData.mailId) {
        toast({
          title: "Validation error",
          description: "Mail ID is required",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Basic validation for job update
      if (!jobUpdateData.companyName) {
        toast({
          title: "Validation error",
          description: "Company name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobUpdateData.summary) {
        toast({
          title: "Validation error",
          description: "Summary is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobUpdateData.mailId) {
        toast({
          title: "Validation error",
          description: "Mail ID is required",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  // Handle save action
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      if (jobType === JOB_TYPES.NEW_JOB) {
        await createJob(jobData);
        toast({
          title: "Success",
          description: "Job posting created successfully",
        });
      } else {
        await createJobUpdate(jobUpdateData);
        toast({
          title: "Success",
          description: "Job update created successfully",
        });
      }

      // Navigate to jobs page after saving
      void navigate("/jobs");
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: `Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section with Gradient Background */}
      {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-8 rounded-2xl shadow-lg m-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <Button
                variant="ghost"
                className="mb-4 text-white hover:text-white/80"
                onClick={() => void navigate("/jobs")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {jobType === JOB_TYPES.NEW_JOB ? (
                  <>
                    Create New <span className="text-yellow-300">Job Post</span>
                  </>
                ) : (
                  <>
                    Post Job <span className="text-yellow-300">Update</span>
                  </>
                )}
              </h1>
              <p className="text-indigo-100 mb-6 text-lg max-w-xl">
                {jobType === JOB_TYPES.NEW_JOB
                  ? "Create a detailed job posting to attract the perfect candidates for your position."
                  : "Keep candidates informed with important updates about the job posting."}
              </p>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <Lottie
                options={createJobAnimationOptions}
                height={200}
                width={200}
              />
            </div>
          </div>
        </div>
      </div> */}

      <main className="container mx-auto px-6 py-8 -mt-6">
        <Card className="mb-8 gap-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-col space-y-1.5">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {jobType === JOB_TYPES.NEW_JOB ? (
                  <>
                    <Plus className="h-6 w-6 inline mr-2 text-indigo-600" />
                    Job Details
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 inline mr-2 text-indigo-600" />
                    Update Details
                  </>
                )}
              </CardTitle>
            </div>
            <Toggle
              pressed={isEditMode}
              onPressedChange={setIsEditMode}
              className="gap-2 bg-indigo-100 data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
            >
              {isEditMode ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Mode
                </>
              ) : (
                <>
                  <View className="h-4 w-4" />
                  View Mode
                </>
              )}
            </Toggle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                variant={jobType === JOB_TYPES.NEW_JOB ? "default" : "ghost"}
                className={`flex items-center justify-center gap-2 h-16 ${
                  jobType === JOB_TYPES.NEW_JOB
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border-2 border-dashed border-gray-200"
                }`}
                onClick={() => setJobType(JOB_TYPES.NEW_JOB)}
              >
                <FileText
                  className={`h-5 w-5 ${jobType === JOB_TYPES.NEW_JOB ? "text-white" : "text-indigo-600"}`}
                />
                <div className="text-left">
                  <div className="font-medium">New Job Posting</div>
                  <div
                    className={`text-xs ${jobType === JOB_TYPES.NEW_JOB ? "text-white/90" : "text-gray-500"}`}
                  >
                    Create a full job listing
                  </div>
                </div>
              </Button>

              <Button
                variant={jobType === JOB_TYPES.JOB_UPDATE ? "default" : "ghost"}
                className={`flex items-center justify-center gap-2 h-16 ${
                  jobType === JOB_TYPES.JOB_UPDATE
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border-2 border-dashed border-gray-200"
                }`}
                onClick={() => setJobType(JOB_TYPES.JOB_UPDATE)}
              >
                <Bell
                  className={`h-5 w-5 ${jobType === JOB_TYPES.JOB_UPDATE ? "text-white" : "text-indigo-600"}`}
                />
                <div className="text-left">
                  <div className="font-medium">Job Update</div>
                  <div
                    className={`text-xs ${jobType === JOB_TYPES.JOB_UPDATE ? "text-white/90" : "text-gray-500"}`}
                  >
                    Post update for existing job
                  </div>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left panel - Email content */}
              <Card className="shadow-sm bg-white/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Card className="bg-gray-50/80 border-0 mb-4">
                    <CardContent className="p-4">
                      {mails.length > 0 ? (
                        <Select
                          value={
                            jobType === JOB_TYPES.NEW_JOB
                              ? jobData.mailId.toString()
                              : jobUpdateData.mailId.toString()
                          }
                          onValueChange={(value) => {
                            if (jobType === JOB_TYPES.NEW_JOB) {
                              setJobData({
                                ...jobData,
                                mailId: value as Id<"mails">,
                              });
                            } else {
                              setJobUpdateData({
                                ...jobUpdateData,
                                mailId: value as Id<"mails">,
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select email template" />
                          </SelectTrigger>
                          <SelectContent>
                            {mails.map((mail) => (
                              <SelectItem key={mail._id} value={mail._id}>
                                {mail.subject || "No subject"} (
                                {new Date(
                                  mail._creationTime
                                ).toLocaleDateString()}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-500">
                          No email templates available
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <ScrollArea className="h-[calc(100vh-600px)] rounded-lg border bg-white p-4">
                    <TextViewer
                      text={
                        mails.find(
                          (mail) =>
                            mail._id ===
                            (jobType === JOB_TYPES.NEW_JOB
                              ? jobData.mailId
                              : jobUpdateData.mailId)
                        )?.body || sampleText
                      }
                    />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Right panel - Form editor */}
              <Card className="shadow-sm bg-white/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    {jobType === JOB_TYPES.NEW_JOB ? (
                      <>
                        <Plus className="h-5 w-5 text-indigo-600" />
                        Job Information
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 text-indigo-600" />
                        Update Information
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-600px)]">
                    {jobType === JOB_TYPES.NEW_JOB ? (
                      <JobPostingForm
                        data={jobData}
                        onChange={handleDataChange}
                        isEditMode={isEditMode}
                      />
                    ) : (
                      <JobUpdateForm
                        data={jobUpdateData}
                        onChange={handleDataChange}
                        isEditMode={isEditMode}
                      />
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {isEditMode && (
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => void navigate("/jobs")}
              className="gap-2"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {jobType === JOB_TYPES.NEW_JOB
                    ? "Publish Job"
                    : "Post Update"}
                </>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobEditor;
