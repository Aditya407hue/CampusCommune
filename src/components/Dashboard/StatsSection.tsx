import jobsLottie from "@/lotties/jobs-lottie.json";
import companiesLottie from "@/lotties/companies-lottie.json";
import peopleLottie from "@/lotties/people-lottie.json";
import checkLottie from "@/lotties/check-lottie.json";
import Lottie from "react-lottie";
import { useEffect, useRef, useState } from "react";

const StatsSection = () => {
  const stats = [
    {
      number: "1,200+",
      label: "Jobs Available",
      icon: jobsLottie,
      highlight: "indigo",
    },
    {
      number: "300+",
      label: "Partner Companies",
      icon: companiesLottie,
      highlight: "blue",
    },
    {
      number: "25,000+",
      label: "Active Job Seekers",
      icon: peopleLottie,
      highlight: "purple",
    },
    {
      number: "1,800+",
      label: "Successful Placements",
      icon: checkLottie,
      highlight: "green",
    },
  ];

  // For animated counter effect and intersection observation
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-50 rounded-full -ml-36 -mt-36 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mb-48 opacity-70"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We connect <span className="text-indigo-600">talent</span> with{" "}
            <span className="text-blue-600">opportunities</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Campus Commune has helped thousands of students find their dream
            jobs and companies discover exceptional talent
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            // Define colors based on highlight property
            const colorMap = {
              indigo: {
                bg: "bg-indigo-50",
                border: "border-indigo-100",
                text: "text-indigo-600",
                iconBg: "bg-indigo-100",
              },
              blue: {
                bg: "bg-blue-50",
                border: "border-blue-100",
                text: "text-blue-600",
                iconBg: "bg-blue-100",
              },
              purple: {
                bg: "bg-purple-50",
                border: "border-purple-100",
                text: "text-purple-600",
                iconBg: "bg-purple-100",
              },
              green: {
                bg: "bg-green-50",
                border: "border-green-100",
                text: "text-green-600",
                iconBg: "bg-green-100",
              },
            };

            const colors = colorMap[stat.highlight as keyof typeof colorMap];

            return (
              <div
                key={index}
                className={`${colors.bg} border ${colors.border} p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 mb-6 flex items-center justify-center rounded-xl ${colors.iconBg} shadow-sm`}
                  >
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: stat.icon,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid",
                        },
                      }}
                      height={45}
                      width={45}
                    />
                  </div>

                  <div
                    className={`text-3xl md:text-4xl font-bold mb-2 ${colors.text}`}
                  >
                    {stat.number}
                  </div>

                  <div className="text-gray-700 font-medium text-center">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 italic">*Data updated as of April 2025</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
