import { CTA } from "@/components/Dashboard/CTA";
import FeaturedJobs from "@/components/Dashboard/FeaturedJobs";
import Footer from "@/components/Dashboard/Footer";
import HeroSection from "@/components/Dashboard/HeroSection";
import HowItWorks from "@/components/Dashboard/HowItWorks";
import JobCategories from "@/components/Dashboard/JobCategories";
import StatsSection from "@/components/Dashboard/StatsSection";
import Testimonials from "@/components/Dashboard/Testimonials";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useState } from "react";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DashboardView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);

  // For smooth scrolling experience
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content */}
      <main className="flex-grow">
        {/* Use ScrollArea for smooth scrolling */}
        <ScrollArea className="h-full">
          <div className="space-y-0">
            <HeroSection scrollToSection={scrollToSection} />
            <StatsSection />
            <HowItWorks />
            <FeaturedJobs />
            <JobCategories />
            <Testimonials />
            <CTA />
          </div>
        </ScrollArea>
      </main>

      <Footer />

      {/* Job details dialog */}
      {selectedJob && (
        <JobDetailsDialog
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
