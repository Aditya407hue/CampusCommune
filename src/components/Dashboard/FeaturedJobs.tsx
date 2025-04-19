import { useQuery } from "convex/react";
import { Button } from "../../components/ui/button";
import { api } from "../../../convex/_generated/api"
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

const FeaturedJobs = () => {
  // const jobs = [
  //   {
  //     title: "Senior Product Designer",
  //     company: "Google",
  //     location: "Mountain View, CA",
  //     jobType: "Full-time",
  //     salary: "$120k - $150k",
  //     tags: ["UI/UX", "Figma", "Design Systems"],
  //     logo: "🅶",
  //     logoColor: "bg-red-100 text-red-600",
  //   },
  //   {
  //     title: "Frontend Developer",
  //     company: "Airbnb",
  //     location: "Remote",
  //     jobType: "Full-time",
  //     salary: "$90k - $120k",
  //     tags: ["React", "TypeScript", "Tailwind"],
  //     logo: "🅰️",
  //     logoColor: "bg-rose-100 text-rose-600",
  //   },
  //   {
  //     title: "Product Manager",
  //     company: "Microsoft",
  //     location: "Redmond, WA",
  //     jobType: "Full-time",
  //     salary: "$110k - $140k",
  //     tags: ["SaaS", "B2B", "Agile"],
  //     logo: "Ⓜ️",
  //     logoColor: "bg-blue-100 text-blue-600",
  //   },
  //   {
  //     title: "Data Scientist",
  //     company: "Netflix",
  //     location: "Los Gatos, CA",
  //     jobType: "Contract",
  //     salary: "$130k - $160k",
  //     tags: ["Python", "ML", "Big Data"],
  //     logo: "🅽",
  //     logoColor: "bg-red-100 text-red-600",
  //   },
  //   {
  //     title: "DevOps Engineer",
  //     company: "Amazon",
  //     location: "Seattle, WA",
  //     jobType: "Full-time",
  //     salary: "$115k - $145k",
  //     tags: ["AWS", "Docker", "Kubernetes"],
  //     logo: "🅰️",
  //     logoColor: "bg-amber-100 text-amber-600",
  //   },
  //   {
  //     title: "Marketing Specialist",
  //     company: "Spotify",
  //     location: "New York, NY",
  //     jobType: "Full-time",
  //     salary: "$75k - $95k",
  //     tags: ["Digital Marketing", "SEO", "Content"],
  //     logo: "🎵",
  //     logoColor: "bg-green-100 text-green-600",
  //   },
  // ];


  const isAdmin = useQuery(api.users.isAdmin);
  const jobs = useQuery(api.jobs.list, { onlyActive: !isAdmin }) ?? [];
  const [selectedJob, setSelectedJob] = useState<Id<"jobs"> | null>(null);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Jobs</h2>
          <Button className="bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer">
            View All Jobs →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div key={index} className="job-card flex flex-col h-full bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
              <div className="flex items-start mb-4">
              {/* TODO: add ${job?.logoColor || "red"} in below className */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4`}>
                  {/* {job.logo} */}
                  <img src={"https://imgs.search.brave.com/cMeR-TEzSzc3L_T_t4c0ZKSZu5B4BxkMPGrZ48urikE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZ29vZ2xlLXMt/bG9nby8xNTAvR29v/Z2xlX0ljb25zLTA5/LTUxMi5wbmc"} alt="logo" className="w-12 h-12 rounded-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-500 mb-2">
                  <span className="mr-3">📍 {job.location}</span>
                  <span className="badge badge-primary">{job.type}</span>
                </div>
                <div className="text-gray-700 font-medium">Rs. {job.salary}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.map((tag, i) => (
                  <span key={i} className="badge badge-accent">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer">Apply Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
