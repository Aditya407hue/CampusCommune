import createAcc from "./../../lottiefiles/create-acc.json";
import searchJobs from "./../../lottiefiles/search-jobs.json";
import checkAnimated from "./../../lottiefiles/check-animated.json";
import hired from "./../../lottiefiles/hired.json";
import Lottie from "react-lottie";
const HowItWorks = () => {
    const steps = [
      {
        icon: createAcc,
        title: "Create Account",
        description: "Sign up and complete your profile with relevant skills and experience.",
      },
      {
        icon: searchJobs,
        title: "Search Jobs",
        description: "Browse thousands of jobs that match your skills and preferences.",
      },
      {
        icon: checkAnimated,
        title: "Apply Easily",
        description: "Submit your application with just a few clicks and track status.",
      },
      {
        icon: hired,
        title: "Get Hired",
        description: "Interview with top companies and land your dream job.",
      },
    ];
  
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How FindJobs Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process helps you find and apply to jobs quickly and efficiently
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center relative transition-transform duration-200 hover:scale-105 hover:shadow-md"
              >
                {/* {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-200 transform translate-x-1/2">
                    <div className="absolute right-0 top-1/2 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2 translate-x-1/2"></div>
                  </div>
                )} */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {/* {step.icon} */}
                  <Lottie 
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: step.icon,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid",
                      }
                    }}
                    style={{ minWidth: '100px', minHeight: '100px' }}
                    height={120}
                    width={120}
                    />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default HowItWorks;
  