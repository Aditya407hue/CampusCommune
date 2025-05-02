import createAcc from "src/lottiefiles/create-acc.json";
import searchJobs from "src/lottiefiles/search-jobs.json";
import checkAnimated from "src/lottiefiles/check-animated.json";
import hired from "src/lottiefiles/hired.json";
import Lottie from "react-lottie";
import { useEffect, useState, useRef } from "react";
import { ChevronRightIcon } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: createAcc,
      title: "Create Account",
      description:
        "Sign up and complete your profile with relevant skills and experience.",
      color: "red",
    },
    {
      icon: searchJobs,
      title: "Search Jobs",
      description:
        "Browse thousands of jobs that match your skills and preferences.",
      color: "blue",
    },
    {
      icon: checkAnimated,
      title: "Apply Easily",
      description:
        "Submit your application with just a few clicks and track status.",
      color: "purple",
    },
    {
      icon: hired,
      title: "Get Hired",
      description: "Interview with top companies and land your dream job.",
      color: "green",
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-70"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="font-bold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Campus Commune</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our streamlined process helps you find and apply to jobs quickly and
            efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-100 hidden lg:block"></div>

          {steps.map((step, index) => {
            const delay = index * 200;
            const colorMap: Record<string, string> = {
              indigo: "bg-indigo-100 border-indigo-100",
              blue: "bg-blue-50 border-blue-100",
              purple: "bg-purple-50 border-purple-100",
              green: "bg-green-50 border-green-100",
            };

            const bgColor =
              colorMap[step.color] || "bg-gray-50 border-gray-100";

            return (
              <div
                key={index}
                className={`${bgColor} p-6 rounded-xl border shadow-sm relative 
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} 
                  transition-all duration-700 ease-out`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Step number */}
                <div
                  className={`absolute top-0 left-0 -mt-4 -ml-2 w-8 h-8 rounded-full bg-${step.color}-500 text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm`}
                >
                  {index + 1}
                </div>

                {/* Connector arrow (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/3 right-0 transform translate-x-1/2 hidden lg:block z-10">
                    <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 mx-auto mb-6 relative">
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: step.icon,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid",
                        },
                      }}
                      height={112}
                      width={112}
                    />
                  </div>

                  <h3
                    className={`text-xl font-bold mb-3 text-${step.color}-700`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
