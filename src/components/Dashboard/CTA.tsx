import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export function CTA () {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl text-gray-900 md:text-4xl font-bold mb-6">
              Ready to advance your career?
            </h2>
            <p className="text-gray-800 mb-8 text-lg">
              Join thousands of job seekers who have found their dream jobs through FindJobs. Create your profile today and start applying to top companies.
            </p>
            <Button variant="outline" className="group bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer" onClick={()=> navigate("/profile")}>
              Create Your Profile
            </Button>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
              <h3 className="text-2xl text-gray-900 font-bold mb-4">For Employers</h3>
              <p className="text-gray-800 mb-6">
                Looking to hire top talent? Post a job on FindJobs and reach thousands of qualified candidates.
              </p>
              <Button variant="outline" className="group bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer" onClick={()=>navigate("/job-editor")}>
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

