import { Button } from "../../components/ui/button";
import {
  Briefcase,
  PenTool,
  Code,
  TrendingUp,
  DollarSign,
  Stethoscope,
  GraduationCap,
  Handshake,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const JobCategories = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const categories = [
    {
      name: "Design & Creative",
      icon: <PenTool size={22} />,
      count: 235,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      name: "Development",
      icon: <Code size={22} />,
      count: 427,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200",
    },
    {
      name: "Marketing",
      icon: <TrendingUp size={22} />,
      count: 312,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      name: "Finance",
      icon: <DollarSign size={22} />,
      count: 185,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      name: "Healthcare",
      icon: <Stethoscope size={22} />,
      count: 294,
      color: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
    },
    {
      name: "Education",
      icon: <GraduationCap size={22} />,
      count: 156,
      color: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      name: "Sales",
      icon: <Handshake size={22} />,
      count: 203,
      color: "bg-cyan-50",
      iconColor: "text-cyan-600",
      borderColor: "border-cyan-200",
    },
    {
      name: "Customer Service",
      icon: <Headphones size={22} />,
      count: 178,
      color: "bg-teal-50",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="bg-purple-50 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
              Job Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Popular Categories
            </h2>
            <p className="text-gray-600 max-w-xl">
              Explore jobs across various industries and find the perfect match
              for your skills and interests
            </p>
          </div>
          <Button
            onClick={() => void navigate("/jobs")}
            variant="outline"
            className="mt-6 md:mt-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.color} border ${category.borderColor} p-5 md:p-6 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => void navigate("/jobs")}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg bg-white ${category.iconColor}`}
                >
                  {category.icon}
                </div>

                <div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} className="text-gray-500" />
                    <p className="text-gray-500 text-sm">
                      {category.count} jobs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
