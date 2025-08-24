import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import CreateProjectDialog from "./CreateProjectDialog";
import ProjectAnalytics from "./ProjectAnalytics";

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  start_date: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  task_count?: number;
  completed_tasks?: number;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view projects.",
          variant: "destructive"
        });
        return;
      }

      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks(id, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Calculate task statistics for each project
      const projectsWithStats = projectsData?.map(project => ({
        ...project,
        status: project.status as 'active' | 'completed' | 'paused' | 'cancelled',
        priority: project.priority as 'low' | 'medium' | 'high' | 'urgent',
        task_count: project.tasks?.length || 0,
        completed_tasks: project.tasks?.filter((task: any) => task.status === 'completed').length || 0
      })) || [];

      setProjects(projectsWithStats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    setIsCreateDialogOpen(false);
    fetchProjects();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-accent text-accent-foreground';
      case 'paused': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const calculateActualProgress = (project: Project) => {
    if (project.task_count === 0) return 0;
    return Math.round((project.completed_tasks! / project.task_count!) * 100);
  };

  const isProjectLagging = (project: Project) => {
    const actualProgress = calculateActualProgress(project);
    const expectedProgress = project.progress || 0;
    return actualProgress < expectedProgress - 10; // 10% threshold
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">
            Create, track, and analyze your software projects
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const actualProgress = calculateActualProgress(project);
          const isLagging = isProjectLagging(project);
          
          return (
            <Card key={project.id} className="hover:shadow-lg lovable-transition border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {project.name}
                  </CardTitle>
                  {isLagging && (
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{actualProgress}%</span>
                  </div>
                  <Progress value={actualProgress} className="h-2" />
                  {isLagging && (
                    <p className="text-xs text-warning">
                      Behind expected progress ({project.progress}%)
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{project.completed_tasks}/{project.task_count} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {project.end_date 
                        ? new Date(project.end_date).toLocaleDateString()
                        : "No deadline"
                      }
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedProject(project)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start tracking progress and getting AI insights
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateProject}
      />

      {selectedProject && (
        <ProjectAnalytics 
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectManager;