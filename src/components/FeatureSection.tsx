
import { Activity, Award, Gauge, Globe, LayoutDashboard, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Award className="w-6 h-6 text-zenblue" />,
    title: "Real-time Leaderboard",
    description: "Track performance metrics and rankings as they happen with our dynamic leaderboard system.",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-zenblue" />,
    title: "Intuitive Dashboard",
    description: "Access all your important data at a glance with our beautifully designed user interface.",
  },
  {
    icon: <LineChart className="w-6 h-6 text-zenblue" />,
    title: "Performance Analytics",
    description: "Gain insights into your progress with detailed charts and data visualization tools.",
  },
  {
    icon: <Gauge className="w-6 h-6 text-zenblue" />,
    title: "Speed Optimization",
    description: "Experience lightning-fast performance with our optimized platform architecture.",
  },
  {
    icon: <Globe className="w-6 h-6 text-zenblue" />,
    title: "Global Connectivity",
    description: "Connect with performers worldwide and benchmark against international standards.",
  },
  {
    icon: <Activity className="w-6 h-6 text-zenblue" />,
    title: "Activity Monitoring",
    description: "Keep track of your daily activities and monitor progress toward your goals.",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="section-spacing bg-zinc-50">
      <div className="page-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <div className="bg-zenblue/10 rounded-full px-4 py-1.5 text-sm font-medium text-zenblue">
              Features
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4">
            Everything you need to excel
          </h2>
          
          <p className="text-lg text-zinc-600 text-balance">
            Our platform provides all the tools necessary for tracking, analyzing, and improving your performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-white rounded-xl p-6 border border-zinc-200/80",
                "hover:shadow-lg hover:border-zinc-300/80",
                "transform transition-all duration-300 hover:-translate-y-1"
              )}
            >
              <div className="mb-4 bg-zinc-100 w-12 h-12 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
