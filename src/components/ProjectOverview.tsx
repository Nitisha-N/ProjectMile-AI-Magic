import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Users,
  Target,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectOverview = () => {
  const projects = [
    {
      name: "E-commerce Platform Rebuild",
      status: "In Progress",
      progress: 68,
      dueDate: "Dec 15, 2024",
      team: ["JD", "SM", "AK"],
      priority: "High",
      tasks: { completed: 24, total: 35 }
    },
    {
      name: "Mobile App Feature Update",
      status: "Review",
      progress: 92,
      dueDate: "Nov 30, 2024",
      team: ["MR", "LK"],
      priority: "Medium",
      tasks: { completed: 18, total: 19 }
    },
    {
      name: "API Security Enhancement",
      status: "Planning",
      progress: 25,
      dueDate: "Jan 20, 2025",
      team: ["TR", "NK", "PL"],
      priority: "High", 
      tasks: { completed: 5, total: 20 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "default";
      case "Review": return "secondary";
      case "Planning": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "High" ? "destructive" : "secondary";
  };

  return (
    <Card className="portia-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Projects</span>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{project.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due {project.dueDate}</span>
                    <Badge variant={getPriorityColor(project.priority)} className="text-xs">
                      {project.priority}
                    </Badge>
                  </div>
                </div>
                <Badge variant={getStatusColor(project.status)} className="text-xs">
                  {project.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {project.team.map((member, idx) => (
                      <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {member}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.team.length} members
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.tasks.completed}/{project.tasks.total} tasks
                </div>
              </div>
              
              {index < projects.length - 1 && (
                <div className="border-b border-border/50 pt-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;