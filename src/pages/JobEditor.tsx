import { useState, useEffect } from "react";
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
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Interfaces and constants
interface Mail {
  _id: Id<"mails">;
  _creationTime: number;
  mailContent: string;
  companyName?: string | null;
  classification: string;
  reason: string;
  isApproved: boolean;
}

interface Job {
  _id?: Id<"jobs">;
  title?: string | null;
  company?: string | null;
  description?: string | null;
  location?: string | null;
  type?: "full-time" | "part-time" | "internship" | "trainee";
  skills?: string[];
  salary?: {
    stipend?: string | null;
    postConfirmationCTC?: string | null;
  } | null;
  deadline?: string | null;
  isActive?: boolean;
  createdBy?: Id<"users">;
  applicationLink?: string[] | null;
  moreDetails?: {
    eligibility?: string | null;
    selectionProcess?: string[];
    serviceAgreement?: string | null;
    training?: string | null;
    joiningDate?: string | null;
    requiredDocuments?: string | null;
    companyWebsite?: string | null;
  } | null;
  mailId: Id<"mails">;
}

interface JobUpdateType {
  _id?: Id<"jobUpdates">;
  summary?: string | null;
  mailId: Id<"mails">;
  jobId?: Id<"jobs">;
  companyName?: string;
}

interface UserProfile {
  _id: Id<"profiles">;
  userId: Id<"users">;
  role: "student" | "admin" | "pr";
  name: string;
  department: string;
  graduationYear: number;
  skills: string[];
  resumeFileId?: Id<"_storage">;
}

const sampleText =
  "Welcome to the Job Editor!\n\nThis is a sample text that demonstrates how new lines work.\nYou can edit the JSON on the right side.\n\nThe editor supports:\n- View mode\n- Edit mode\n- JSON validation\n- Easy formatting";

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

const initialJobUpdateData = {
  companyName: "",
  summary: "",
  mailId: "" as Id<"mails">,
};

const JOB_TYPES = {
  NEW_JOB: "new_job_posting",
  JOB_UPDATE: "job_update",
} as const;

// Classification to job type mapping
const CLASSIFICATION_TO_TYPE = {
  "New Job": JOB_TYPES.NEW_JOB,
  "Job Posting": JOB_TYPES.NEW_JOB,
  Recruitment: JOB_TYPES.NEW_JOB,
  Internship: JOB_TYPES.NEW_JOB,
  Update: JOB_TYPES.JOB_UPDATE,
  "Deadline Extension": JOB_TYPES.JOB_UPDATE,
  "Process Update": JOB_TYPES.JOB_UPDATE,
  "Interview Schedule": JOB_TYPES.JOB_UPDATE,
};

// Function to get current user profile
const useCurrentUserProfile = () => {
  const { isAuthenticated } = useConvexAuth();
  const userProfile = useQuery(api.users.getProfile);
  const userId = userProfile?.userId;
  return {
    isAuthenticated,
    userId,
    userProfile,
  };
};

const JobEditor = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [jobType, setJobType] = useState<string>(JOB_TYPES.NEW_JOB);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMailId, setSelectedMailId] = useState<Id<"mails"> | "">("");
  const [jobFormData, setJobFormData] = useState<Partial<Job>>(initialJobData);
  const [jobUpdateFormData, setJobUpdateFormData] =
    useState<any>(initialJobUpdateData);

  // Track connection state
  const [connectionState, setConnectionState] = useState<{
    hasJob: boolean;
    hasJobUpdate: boolean;
    originalType: string | null;
  }>({
    hasJob: false,
    hasJobUpdate: false,
    originalType: null,
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, userId, userProfile } = useCurrentUserProfile();

  // Get mail data
  const mails = useQuery(api.mails.getUnapprovedMails)?.sort((a, b) => {
    return (
      new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
    );
  });

  // Get job and job update data for the selected mail
  const existingJob = useQuery(
    api.jobs.getJobByMailId,
    selectedMailId !== "" ? { mailId: selectedMailId } : "skip"
  );

  const existingJobUpdates = useQuery(
    api.jobUpdates.getJobUpdateByMailId,
    selectedMailId !== "" ? { mailId: selectedMailId } : "skip"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Mutations for CRUD operations
  const createJob = useMutation(api.jobs.create);
  const createJobUpdate = useMutation(api.jobUpdates.create);
  const updateJobData = useMutation(api.jobs.update);
  const updateJobUpdateData = useMutation(api.jobUpdates.update);
  const deleteJob = useMutation(api.jobs.deleteJob);
  const deleteJobUpdate = useMutation(api.jobUpdates.deleteJobUpdate);
  const approveMail = useMutation(api.mails.approveMail);
  // When a mail is selected, determine what connections it has and update state
  useEffect(() => {
    if (!selectedMailId) return;

    console.log(selectedMailId);
    setIsLoading(true);

    if (existingJob === undefined || existingJobUpdates === undefined) return;

    const selectedMail = mails?.find((mail) => mail._id === selectedMailId);
    const hasJob = Boolean(existingJob);
    console.log(existingJob);
    const hasJobUpdate = Boolean(
      existingJobUpdates && existingJobUpdates.length > 0
    );
    console.log(existingJobUpdates);

    console.log(hasJob, hasJobUpdate);

    setIsLoading(false);

    // Update connection state
    setConnectionState({
      hasJob,
      hasJobUpdate,
      originalType: hasJob
        ? JOB_TYPES.NEW_JOB
        : hasJobUpdate
          ? JOB_TYPES.JOB_UPDATE
          : null,
    });

    // If connection exists, keep the existing type and data
    if (hasJob) {
      setJobType(JOB_TYPES.NEW_JOB);
      // Populate job form data
      if (existingJob) {
        setJobFormData({
          ...existingJob,
        });
      }
    } else if (hasJobUpdate) {
      setJobType(JOB_TYPES.JOB_UPDATE);
      // Populate job update form data
      if (existingJobUpdates && existingJobUpdates.length > 0) {
        const jobUpdate = existingJobUpdates[0];
        setJobUpdateFormData({
          ...jobUpdate,
          companyName: existingJob?.company || "",
        });
      }
    }
    // If no connection exists, automatically determine type based on classification
    else if (selectedMail) {
      // Set job type based on mail classification if mapping exists
      const classification = selectedMail.classification;

      // Auto-detect job type based on classification
      const autoDetectedType =
        CLASSIFICATION_TO_TYPE[
          classification as keyof typeof CLASSIFICATION_TO_TYPE
        ] ||
        (classification.toLowerCase().includes("update") ||
        classification.toLowerCase().includes("deadline")
          ? JOB_TYPES.JOB_UPDATE
          : JOB_TYPES.NEW_JOB);

      setJobType(autoDetectedType);

      if (autoDetectedType === JOB_TYPES.NEW_JOB) {
        setJobFormData({
          ...initialJobData,
          company: selectedMail.companyName || "",
          mailId: selectedMailId,
        });
      } else {
        setJobUpdateFormData({
          ...initialJobUpdateData,
          companyName: selectedMail.companyName || "",
          mailId: selectedMailId,
        });
      }
    }
  }, [selectedMailId, existingJob, existingJobUpdates, mails]);

  // Handle data changes based on job type
  const handleJobFormDataChange = (data: any) => {
    setJobFormData((prev) => ({ ...prev, ...data }));
  };

  const handleJobUpdateFormDataChange = (data: any) => {
    setJobUpdateFormData((prev: any) => ({ ...prev, ...data }));
  };

  // Validate form data before saving
  const validateForm = () => {
    if (jobType === JOB_TYPES.NEW_JOB) {
      // Basic validation for job posting
      if (!jobFormData.title) {
        toast({
          title: "Validation error",
          description: "Job title is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobFormData.company) {
        toast({
          title: "Validation error",
          description: "Company name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!selectedMailId) {
        toast({
          title: "Validation error",
          description: "Mail ID is required",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // Basic validation for job update
      if (!jobUpdateFormData.companyName) {
        toast({
          title: "Validation error",
          description: "Company name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!jobUpdateFormData.summary) {
        toast({
          title: "Validation error",
          description: "Summary is required",
          variant: "destructive",
        });
        return false;
      }

      if (!selectedMailId) {
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

  // Handle save action - now handles all three cases
  const handleSave = async () => {
    if (!validateForm() || !selectedMailId) return;

    setIsSaving(true);

    try {
      // CASE 1: Update existing (same type)
      if (
        (connectionState.hasJob && jobType === JOB_TYPES.NEW_JOB) ||
        (connectionState.hasJobUpdate && jobType === JOB_TYPES.JOB_UPDATE)
      ) {
        if (jobType === JOB_TYPES.NEW_JOB && existingJob) {
          // Update existing job
          await updateJobData({
            jobId: existingJob._id,
            ...jobFormData,
          });
          toast({
            title: "Success",
            description: "Job posting updated successfully",
          });
        } else if (
          jobType === JOB_TYPES.JOB_UPDATE &&
          existingJobUpdates &&
          existingJobUpdates.length > 0
        ) {
          // Update existing job update
          await updateJobUpdateData({
            jobUpdateId: existingJobUpdates[0]._id,
            summary: jobUpdateFormData.summary,
          });
          toast({
            title: "Success",
            description: "Job update updated successfully",
          });
        }
      }
      // CASE 2: Change type (delete old, create new)
      else if (
        (connectionState.hasJob && jobType === JOB_TYPES.JOB_UPDATE) ||
        (connectionState.hasJobUpdate && jobType === JOB_TYPES.NEW_JOB)
      ) {
        // First delete the existing connection
        if (connectionState.hasJob && existingJob) {
          await deleteJob({ jobId: existingJob._id });
        } else if (
          connectionState.hasJobUpdate &&
          existingJobUpdates &&
          existingJobUpdates.length > 0
        ) {
          await deleteJobUpdate({ jobUpdateId: existingJobUpdates[0]._id });
        }

        // Then create the new type
        if (jobType === JOB_TYPES.NEW_JOB) {
          await createJob({
            ...jobFormData,
            mailId: selectedMailId,
          });
          toast({
            title: "Success",
            description: "Changed to job posting successfully",
          });
        } else {
          // Find a job for this company to associate the update with
          const companyName = jobUpdateFormData.companyName;
          await createJobUpdate({
            summary: jobUpdateFormData.summary,
            mailId: selectedMailId,
            companyName,
          });
          toast({
            title: "Success",
            description: "Changed to job update successfully",
          });
        }
      }
      // CASE 3: Create new (no previous connection)
      else {
        if (jobType === JOB_TYPES.NEW_JOB) {
          await createJob({
            ...jobFormData,
            mailId: selectedMailId,
          });
          toast({
            title: "Success",
            description: "New job posting created successfully",
          });
        } else {
          const companyName = jobUpdateFormData.companyName;
          await createJobUpdate({
            summary: jobUpdateFormData.summary,
            mailId: selectedMailId,
            companyName,
          });
          toast({
            title: "Success",
            description: "New job update created successfully",
          });
        }
      }

      // If PR user is processing this mail, mark it as approved
      if ((userProfile?.role === "pr" || userProfile?.role==="admin")  && selectedMailId) {
        await approveMail({
          mailId: selectedMailId,
          userId: userId as Id<"users">,
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

  if (userProfile?.role === "student") return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

            {/* Connection state indicator */}
            {selectedMailId &&
              (connectionState.hasJob || connectionState.hasJobUpdate) && (
                <div className="mb-6 p-4 border rounded-md bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-700 font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    This email is currently{" "}
                    {connectionState.hasJob ? "a job posting" : "a job update"}.
                    {connectionState.originalType !== jobType &&
                      " Changing the type will replace the existing entry."}
                  </p>
                </div>
              )}

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
                      {mails && mails.length > 0 ? (
                        <Select
                          value={selectedMailId ? selectedMailId : undefined}
                          onValueChange={(value) => {
                            setSelectedMailId(value as Id<"mails">);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select email" />
                          </SelectTrigger>
                          <SelectContent>
                            {mails.map((mail) => (
                              <SelectItem key={mail._id} value={mail._id}>
                                {/* {mail.companyName || "Unknown"}:{" "}
                                {mail.classification} ({mail.reason}) */}
                                {mail.subject}
                                {new Date(mail._creationTime).toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-500">No emails available</p>
                      )}
                    </CardContent>
                  </Card>

                  <ScrollArea className="h-[calc(100vh-400px)] rounded-lg border bg-white p-4">
                    <TextViewer
                      text={
                        (mails &&
                          mails.find((mail) => mail._id === selectedMailId)
                            ?.mailContent) ||
                        sampleText
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
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    {jobType === JOB_TYPES.NEW_JOB ? (
                      <JobPostingForm
                        data={jobFormData}
                        onChange={handleJobFormDataChange}
                        isEditMode={isEditMode}
                      />
                    ) : (
                      <JobUpdateForm
                        data={jobUpdateFormData}
                        onChange={handleJobUpdateFormDataChange}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isSaving || !selectedMailId}
                  className="gap-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {connectionState.hasJob || connectionState.hasJobUpdate
                        ? connectionState.originalType === jobType
                          ? "Update"
                          : "Change Type & Save"
                        : jobType === JOB_TYPES.NEW_JOB
                          ? "Publish Job"
                          : "Post Update"}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                style={{ zIndex: 9999 }}
                className="fixed bg-white"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                  <AlertDialogDescription>
                    {connectionState.hasJob || connectionState.hasJobUpdate
                      ? connectionState.originalType === jobType
                        ? "Are you sure you want to update this record?"
                        : "Changing the type will delete the existing record and create a new one. Continue?"
                      : "Are you sure you want to create this new record?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleSave()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobEditor;
