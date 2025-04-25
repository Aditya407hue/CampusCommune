import { useQuery } from "convex/react";
import Applications from "./../components/Applications/Applications";
import { api } from "../../convex/_generated/api";

export function ApplicationsView({ isAdmin }: { isAdmin: boolean }) {
  // Fetch applications WITH job details using the appropriate query
  const applicationsWithJobs = useQuery(api.applications.listByStudent) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Applications applications={applicationsWithJobs} />
    </div>
  );
}
