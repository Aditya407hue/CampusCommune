import { Dialog } from "@headlessui/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2Icon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  BanknoteIcon,
  FileUpIcon,
  XIcon,
  PaperclipIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { error } from "console";

interface JobDetailsDialogProps {
  jobId: Id<"jobs">;
  onClose: () => void;
}

export function JobDetailsDialog({ jobId, onClose }: JobDetailsDialogProps) {
  const job = useQuery(api.jobs.getById, { jobId }) ?? {
    mailId: null,
    companyName: "Loading...",
    role: "Loading...",
    jobDetails: "Loading...",
    salary: {
      stipend: "Loading...",
      postConfirmationCTC: "Loading...",
    },
    title: "Loading...",
    location: "Loading...",
    applicationLink: ["Loading..."],
    deadline: "Loading...",
    company: "Loading...",
    type: "Loading...",
    skills: ["Loading..."],
    description: "Loading...",
    moreDetails: {
      eligibility: "Loading...",
      selectionProcess: ["Loading..."],
      serviceAgreement: "Loading...",
      training: "Loading...",
      joiningDate: "Loading...",
      requiredDocuments: "Loading...",
      companyWebsite: "Loading...",
    },
  };

  // Fetch mail data to get attachment links
  const mailData = useQuery(
    api.mails.getMailById,
    job?.mailId ? { mailId: job.mailId } : "skip"
  );

  const attachmentLinks = mailData?.attachmentLinks || [];
  const apply = useMutation(api.applications.apply);
  const [resume, setResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setResume(files[0]);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!resume) {
    //   toast.error("Please upload your resume");
    //   return;
    // }

    try {
      setIsUploading(true);
      await apply({ jobId });
      setIsUploading(false);
      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      setIsUploading(false);
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full bg-white rounded-2xl p-8 shadow-xl h-[40rem] overflow-scroll">
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                {job.title}
              </Dialog.Title>
              <div className="flex items-center text-gray-600 mt-1">
                <Building2Icon className="h-4 w-4 mr-2" />
                <span>{job.company}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Job tags/badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                <BriefcaseIcon className="h-3 w-3 mr-1" />
                {job.type}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {job.location}
              </span>
            )}
            {job.deadline && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Deadline: {job.deadline}
              </span>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Description
                </h4>
                <div className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {job.description ?? "No description provided."}
                </div>
              </div>

              {/* Salary information */}
              {job.salary &&
                (job.salary.stipend || job.salary.postConfirmationCTC) && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <BanknoteIcon className="h-4 w-4 mr-2 text-green-600" />
                      Compensation
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      {job.salary.stipend && (
                        <div className="flex items-center">
                          <span className="font-medium">Stipend:</span>
                          <span className="ml-2">{job.salary.stipend}</span>
                        </div>
                      )}
                      {job.salary.postConfirmationCTC && (
                        <div className="flex items-center">
                          <span className="font-medium">CTC:</span>
                          <span className="ml-2">
                            {job.salary.postConfirmationCTC}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Attachments */}
              {attachmentLinks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <PaperclipIcon className="h-4 w-4 mr-2 text-indigo-600" />
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {attachmentLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline p-2 bg-indigo-50 rounded-md"
                      >
                        <PaperclipIcon className="h-4 w-4 mr-2" />
                        Attachment {index + 1}
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Application link */}
              {job.applicationLink && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Application Links
                  </h4>
                  <div className="text-gray-600 space-y-1">
                    {job.applicationLink.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* More details if available */}
              {job.moreDetails && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Additional Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {job.moreDetails.eligibility && (
                      <div>
                        <span className="font-medium">Eligibility:</span>
                        <p>{job.moreDetails.eligibility}</p>
                      </div>
                    )}
                    {job.moreDetails.selectionProcess && (
                      <div>
                        <span className="font-medium">Selection Process:</span>
                        <p>{job.moreDetails.selectionProcess}</p>
                      </div>
                    )}
                    {job.moreDetails.joiningDate && (
                      <div>
                        <span className="font-medium">Joining Date:</span>
                        <p>{job.moreDetails.joiningDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Application form */}
          <Separator className="my-6" />
          {hasApplied ? (
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Application Submitted!
              </h3>
              <p className="text-green-700">
                Your application has been submitted successfully. You can track
                its status in the Applications section.
              </p>
              <Button
                onClick={onClose}
                className="mt-4 bg-white text-green-700 border border-green-200 hover:bg-green-50"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  // disabled={isUploading || !resume}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    handleApply(e);
                  }}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
