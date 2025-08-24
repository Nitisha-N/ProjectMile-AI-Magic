import Dashboard from "@/components/Dashboard";
import ProjectManager from "@/components/ProjectManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mt-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <div className="container mx-auto px-6 py-8">
            <ProjectManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
