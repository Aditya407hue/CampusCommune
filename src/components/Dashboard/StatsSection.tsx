import jobsLottie from "./../../lottiefiles/jobs-lottie.json";
import companiesLottie from "./../../lottiefiles/companies-lottie.json";
import peopleLottie from "./../../lottiefiles/people-lottie.json";
import checkLottie from "./../../lottiefiles/check-lottie.json";
import Lottie from "react-lottie";

const StatsSection = () => {
    const stats = [
      { number: "1,200+", label: "Jobs", icon: jobsLottie },
      { number: "300+", label: "Companies", icon: companiesLottie },
      { number: "25,000+", label: "Job Seekers", icon: peopleLottie },
      { number: "1,800+", label: "Jobs Filled", icon: checkLottie  },
    ];
  
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl text-center border border-gray-100 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
              >
                <div className="text-3xl mb-3">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: stat.icon,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid",
                      }
                    }}
                    style={{ minWidth: '50px', minHeight: '50px' }}
                    height={50}
                    width={50}
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default StatsSection;
  