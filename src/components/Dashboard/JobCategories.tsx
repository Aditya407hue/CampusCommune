import { Button } from "../../components/ui/button";

const JobCategories = () => {
  const categories = [
    { name: "Design & Creative", icon: "🎨", count: 235, color: "bg-blue-50" },
    { name: "Development", icon: "💻", count: 427, color: "bg-purple-50" },
    { name: "Marketing", icon: "📈", count: 312, color: "bg-teal-50" },
    { name: "Finance", icon: "💰", count: 185, color: "bg-amber-50" },
    { name: "Healthcare", icon: "⚕️", count: 294, color: "bg-rose-50" },
    { name: "Education", icon: "🎓", count: 156, color: "bg-green-50" },
    { name: "Sales", icon: "🤝", count: 203, color: "bg-blue-50" },
    { name: "Customer Service", icon: "🎧", count: 178, color: "bg-purple-50" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Popular Categories</h2>
          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer">
            Explore All →
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className={`category-card ${category.color} flex flex-col items-center p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1`}>
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-center mb-1">{category.name}</h3>
              <p className="text-gray-500 text-sm">{category.count} jobs</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
