import { useQuery } from "convex/react";
import Applications from "./../components/Applications/Applications";
import { api } from "../../convex/_generated/api";

export function ApplicationsView({ isAdmin }: { isAdmin: boolean }) {
    // Fetch applications WITH job details using the appropriate query
    // Assuming a query like 'listWithJobs' exists or 'list' is modified to return this structure
    const applicationsWithJobs = useQuery(api.applications.listByStudent) ?? []; // Use the query that returns ApplicationWithJob[]
  
    // Admin view (if needed, adjust similarly)
    // if (isAdmin) { ... }
  
    // Pass the fetched data with job details to the Applications component
    return <Applications applications={applicationsWithJobs} />;
  }