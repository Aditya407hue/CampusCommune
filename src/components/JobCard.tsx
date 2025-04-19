import { Id } from "../../convex/_generated/dataModel";

interface JobCardProps {
  job: {
    _id: Id<"jobs">;
    title: string;
    company: string;
    location: string;
    type: "full-time" | "internship" | "part-time";
    deadline: number;
  };
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-4">{job.company}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{job.location}</span>
        <span className="capitalize">{job.type}</span>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Deadline: {new Date(job.deadline).toLocaleDateString()}
      </div>
    </div>
  );
}
