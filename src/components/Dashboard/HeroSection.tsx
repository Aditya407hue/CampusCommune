import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, ArrowDownCircle, ChevronDown } from "lucide-react";
import animationData from "@/lotties/search-lottie.json";
import flybusinessman from "@/lotties/flying-businessman.json";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  scrollToSection?: (id: string) => void;
}

const HeroSection = ({ scrollToSection }: HeroSectionProps) => {
  const searchAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const flyBusinessmanOptions = {
    loop: true,
    autoplay: true,
    animationData: flybusinessman,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleScrollToFeaturedJobs = () => {
    if (scrollToSection) {
      scrollToSection("featured-jobs");
    }
  };
  const navigate=useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-blue-300 to-emerald-300 pt-16 pb-20 md:pb-32 overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-indigo-400 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 text-white">
            <div className="max-w-md mb-8">
              <Lottie
                options={flyBusinessmanOptions}
                height={120}
                width={180}
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find a job that suits
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-fuchsia-600">
                {" "}
                your interest & skills
              </span>
            </h1>
            <p className=" mb-8 text-lg md:pr-12 leading-relaxed font-bold">
              Discover thousands of job opportunities with all the information
              you need. Your future career starts here.
            </p>

            <div className="flex flex-col sm:flex-row w-full max-w-xl gap-4 bg-white/10 backdrop-blur-md p-2 rounded-xl">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12 w-full bg-white text-black border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              <Button className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={()=>navigate("/jobs ")}>
                Search Jobs
              </Button>
            </div>

            <div className="mt-8 hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleScrollToFeaturedJobs}
                className="text-white border-white/30 hover:bg-white/10 gap-2 group bg-gradient-to-r text-white from-indigo-600 to-purple-600 cursor-pointer"
              >
                <span>Explore jobs</span>
                <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -left-6 top-1/4 w-12 h-12 bg-blue-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute -right-10 bottom-1/4 w-20 h-20 bg-indigo-300 rounded-full opacity-20 blur-xl animate-pulse"></div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                <Lottie
                  options={searchAnimationOptions}
                  height={400}
                  width={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-16 md:h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#ffffff"
            fillOpacity="1"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
