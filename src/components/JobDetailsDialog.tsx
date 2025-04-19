import { Dialog } from "@headlessui/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

interface JobDetailsDialogProps {
  jobId: Id<"jobs">;
  onClose: () => void;
}

export function JobDetailsDialog({ jobId, onClose }: JobDetailsDialogProps) {
  const job = useQuery(api.jobs.getById, { jobId });
  const isAdmin = useQuery(api.users.isAdmin);
  const [isUploading, setIsUploading] = useState(false);
  const apply = useMutation(api.applications.apply);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  if (!job) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) {
        toast.error("Please select a resume file");
        return;
      }

      // Get upload URL
      const postUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Submit application
      await apply({ jobId, resumeFileId: storageId });
      toast.success("Application submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl p-6">
          <Dialog.Title className="text-2xl font-bold mb-4">{job.title}</Dialog.Title>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Company</h4>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <div>
              <h4 className="font-medium">Location</h4>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <div>
              <h4 className="font-medium">Job Type</h4>
              <p className="text-gray-600 capitalize">{job.type}</p>
            </div>
            {job.salary && (
              <div>
                <h4 className="font-medium">Salary</h4>
                <p className="text-gray-600">${job.salary.toLocaleString()}/year</p>
              </div>
            )}
            <div>
              <h4 className="font-medium">Required Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Application Deadline</h4>
              <p className="text-gray-600">
                {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
          {!isAdmin && (
            <form onSubmit={handleApply} className="mt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Apply Now"}
                </button>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
