import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface ApplicationCardProps {
  application: {
    _id: Id<"applications">;
    jobId: Id<"jobs">;
    studentId: Id<"users">;
    status: "pending" | "shortlisted" | "rejected" | "accepted";
    appliedAt: number;
  };
  isAdmin: boolean;
}

export function ApplicationCard({ application, isAdmin }: ApplicationCardProps) {
  const job = useQuery(api.jobs.getById, { jobId: application.jobId });
  const updateStatus = useMutation(api.applications.updateStatus);

  if (!job) return null;

  const handleStatusUpdate = async (status: "pending" | "shortlisted" | "rejected" | "accepted") => {
    try {
      await updateStatus({ applicationId: application._id, status });
      toast.success("Application status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-4">{job.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                application.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : application.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : application.status === "shortlisted"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {application.status}
            </span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate("shortlisted")}
              className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
            >
              Shortlist
            </button>
            <button
              onClick={() => handleStatusUpdate("accepted")}
              className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusUpdate("rejected")}
              className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
