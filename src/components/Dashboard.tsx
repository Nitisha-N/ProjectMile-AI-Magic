import Header from "./Header";
import DashboardStats from "./DashboardStats";
import AIInsights from "./AIInsights";
import ProjectOverview from "./ProjectOverview";
import PortiaConfig from "./PortiaConfig";
import heroImage from "@/assets/hero-dashboard.jpg";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-50" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              AI-Powered Project Management
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Leverage Portia's AI capabilities to optimize your software development workflow, 
              predict bottlenecks, and deliver projects faster than ever.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-lg border">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm">AI Analysis Active</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-lg border">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm">12 Projects Tracked</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-lg border">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm">24 Team Members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AIInsights />
          </div>
          <div className="lg:col-span-1">
            <ProjectOverview />
          </div>
        </div>
        
        <PortiaConfig />
      </main>
    </div>
  );
};

export default Dashboard;