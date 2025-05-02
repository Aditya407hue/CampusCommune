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
import { useState, useEffect } from "react";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardView({ isAdmin }: { isAdmin: boolean }) {
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);
  // const [showResumePopup, setShowResumePopup] = useState(false);
  const [showResumeText, setShowResumeText] = useState(false);

  // Show resume analysis popup and text animation when component mounts
  useEffect(() => {
    // First show only the icon
    setShowResumeText(false);
    
    // After 3 seconds, show the text next to the icon
    const textTimer = setTimeout(() => {
      setShowResumeText(true);
    }, 2000);
    
    // After 6 seconds, show the popup (giving time for text animation to complete)
    
    return () => {
      clearTimeout(textTimer)
    };
  }, []);

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
            {/* <HowItWorks /> */}
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

<Link
          to="/ats-analysis"
          className={`fixed bottom-8 right-8 bg-indigo-600 text-white ${showResumeText ? 'px-4 py-2' : 'p-4'} rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out transform flex items-center justify-center gap-2`}
          title="Analyze Resume with ATS" 
        >
          <span 
            className={`font-semibold overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${showResumeText ? 'max-w-32 opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'}`}
          >
            Resume Analysis
          </span>
          <FileText className="h-6 w-6" />
        </Link>
        
      {/* Resume Analysis Popup */}
     
    </div>
  );
}
