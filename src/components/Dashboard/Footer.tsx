const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const footerLinks = [
      {
        title: "For Job Seekers",
        links: [
          { name: "Browse Jobs", url: "#" },
          { name: "Browse Companies", url: "#" },
          { name: "Salary Calculator", url: "#" },
          { name: "Career Advice", url: "#" },
          { name: "Resume Builder", url: "#" },
        ],
      },
      {
        title: "For Employers",
        links: [
          { name: "Post a Job", url: "#" },
          { name: "Browse Candidates", url: "#" },
          { name: "Recruitment Solutions", url: "#" },
          { name: "Pricing", url: "#" },
          { name: "Enterprise Solutions", url: "#" },
        ],
      },
      {
        title: "Resources",
        links: [
          { name: "Help Center", url: "#" },
          { name: "Blog", url: "#" },
          { name: "Career Research", url: "#" },
          { name: "Success Stories", url: "#" },
          { name: "Job Market Trends", url: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { name: "About Us", url: "#" },
          { name: "Contact Us", url: "#" },
          { name: "Privacy Policy", url: "#" },
          { name: "Terms of Service", url: "#" },
          { name: "Affiliate Program", url: "#" },
        ],
      },
    ];
  
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerLinks.map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-white mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a 
                        href={link.url} 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="font-bold text-xl text-white mb-2">FindJobs</div>
                <p className="text-gray-400 text-sm">
                  Connecting talent with opportunity. Finding jobs, made simple.
                </p>
              </div>
              <div className="text-sm text-gray-400">
                © {currentYear} FindJobs. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  