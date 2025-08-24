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
      
      {/* Hero Section with floating shapes */}
      <section className="relative overflow-hidden floating-shapes">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl bounce-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
              AI-Powered Project Magic ✨
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Experience the future of software development with Portia's AI that predicts, 
              optimizes, and accelerates your projects like never before.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 bg-card/90 backdrop-blur px-6 py-3 rounded-xl border blue-glow lovable-transition">
                <div className="w-3 h-3 bg-success rounded-full pulse-blue" />
                <span className="text-sm font-medium">AI Analysis Active</span>
              </div>
              <div className="flex items-center gap-3 bg-card/90 backdrop-blur px-6 py-3 rounded-xl border blue-glow lovable-transition">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">12 Projects Tracked</span>
              </div>
              <div className="flex items-center gap-3 bg-card/90 backdrop-blur px-6 py-3 rounded-xl border blue-glow lovable-transition">
                <div className="w-3 h-3 bg-accent rounded-full animate-bounce" />
                <span className="text-sm font-medium">24 Team Members</span>
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