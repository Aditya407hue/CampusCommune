import { InfiniteMovingCards } from "../ui/infiinte-moving-cards";
import { useEffect, useRef, useState } from "react";

const Testimonials = () => {
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

  const testimonials = [
    {
      quote:
        "Campus Commune helped me secure an internship at my dream tech company. The platform made it easy to find and apply for opportunities that matched my skills.",
      name: "Raj Kumar",
      title: "Computer Science Student, Batch 2025",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      quote:
        "As a college placement officer, I've seen a dramatic improvement in our placement rates since partnering with Campus Commune. Their platform streamlines the entire process.",
      name: "Dr. Priya Sharma",
      title: "Head of Placements, Delhi Technical University",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      quote:
        "The resources and interview preparation on Campus Commune were invaluable. I received three job offers and could choose the one that aligned best with my career goals.",
      name: "Ananya Patel",
      title: "Electronics Engineering, Placed at Samsung",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
    },
    {
      quote:
        "Campus Commune's platform helped our company connect with bright young talent across multiple engineering campuses simultaneously. The quality of applicants was exceptional.",
      name: "Vikram Mehta",
      title: "Technical Recruiting Lead, TCS",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4,
    },
    {
      quote:
        "I appreciated how the platform highlighted my skills to potential employers. Within a month, I secured a position that matched my specialized interests in AI research.",
      name: "Shreya Desai",
      title: "Data Science Graduate, Placed at Amazon",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      rating: 5,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full -ml-40 -mb-40 opacity-70"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="bg-purple-50 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hear from our <span className="text-purple-600">community</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Students, universities, and companies share their experiences with
            Campus Commune
          </p>
        </div>

        <div
          className={`transition-opacity duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="[--gap:1.5rem] max-w-7xl"
            itemClassName="bg-white rounded-xl p-8 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-purple-200 w-[350px]"
            renderItem={(testimonial) => (
              <div>
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < testimonial.rating ? "fill-current" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white italic text-base md:text-lg">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100">
                      {testimonial.name}
                    </h4>
                    <p className="text-white text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex justify-center mt-16">
          <button
            className={` cursor-pointer group bg-gradient-to-r text-white from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-lg text-white font-medium py-3 px-8 rounded-lg shadow-sm transition-all duration-300 flex items-center space-x-2 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <span>Join our community</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
