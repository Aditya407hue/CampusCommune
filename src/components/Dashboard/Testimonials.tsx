import { InfiniteMovingCards } from "../ui/infiinte-moving-cards";

const Testimonials = () => {
    const testimonials = [
      {
        quote: "FindJobs helped me land my dream position at a tech company within just 2 weeks of applying. The platform is intuitive and the job recommendations were spot on!",
        name: "Sarah Johnson",
        title: "UX Designer at Google",
        avatar: "👩",
        rating: 5,
      },
      {
        quote: "As a hiring manager, I've found exceptional talent through FindJobs. The quality of candidates and the filtering options save us so much time in our recruitment process.",
        name: "Michael Chen",
        title: "HR Director at Tesla",
        avatar: "👨",
        rating: 5,
      },
      {
        quote: "The resources and career advice on FindJobs gave me the confidence to switch industries. I'm now in a role I love with better pay and work-life balance.",
        name: "Jessica Williams",
        title: "Marketing Manager at Adobe",
        avatar: "👩",
        rating: 4,
      },
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied job seekers and employers who have found success with FindJobs
            </p>
          </div>
  
          <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
              className="[--gap:1.5rem] max-w-7xl"
              itemClassName="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md w-[350px] text-white"
              renderItem={(testimonial) => (
                <div>
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              )}
            />
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  