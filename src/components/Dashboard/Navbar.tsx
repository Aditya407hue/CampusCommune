import { Button } from "../../components/ui/button";
import Lottie from 'react-lottie';
import logoAnimation from "@/lottiefiles/create-acc.json";

const Navbar = () => {
  const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: logoAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <header className="w-full py-4 px-6 md:px-8 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lottie 
              options={logoOptions}
              height={40}
              width={40}
            />
            <div className="font-bold text-2xl gradient-text">FindJobs</div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Find Jobs
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Companies
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">
              Resources
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="outline" className="bg-primary hover:bg-primary/90">
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
