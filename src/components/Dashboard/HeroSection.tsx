import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import animationData from "@/lottiefiles/search-lottie.json"
import flybusinessman from "@/lottiefiles/flying-businessman.json"
import Lottie from 'react-lottie';
const HeroSection = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    
    rendererSettings: {

      preserveAspectRatio: "xMidYMid",
    }
  };
  const flybusinessOptions = {
    loop: true,
    autoplay: true,
    animationData: flybusinessman,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <Lottie 
                options={flybusinessOptions}
                  height={200}
                  width={350}
                />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find a job that suits 
              <span className="gradient-text"> your interest & skills</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg md:pr-12">
              Discover thousands of job opportunities with all the information you need. Your future career starts here.
            </p>
            <div className="flex flex-col sm:flex-row w-full max-w-xl gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="pl-10 h-12 w-full"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer">Search Jobs</Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            {/* <img 
              src="/lovable-uploads/a0868102-188a-463c-8fef-27e33e5e7a51.png" 
              alt="Job Search Illustration" 
              className="w-full max-w-md"
            /> */}
             <Lottie 
                options={defaultOptions}
                  height={400}
                  width={400}
                />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
