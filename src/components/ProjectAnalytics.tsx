import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  RefreshCw,
  Lightbulb,
  Target
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
}

interface AnalysisResult {
  performanceScore: number;
  efficiencyRating: string;
  insights: {
    local: string[];
    portia: any;
    metrics: any;
  };
  recommendations: {
    local: string[];
    portia: any;
  };
  metrics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    progressRate: number;
    isOverdue: boolean;
    hoursVariance: number;
  };
}

interface ProjectAnalyticsProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

const ProjectAnalytics = ({ project, open, onClose }: ProjectAnalyticsProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeProject = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to analyze projects.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-project', {
        body: { projectId: project.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setAnalysis(data);
        toast({
          title: "Analysis Complete",
          description: "Project analysis has been completed successfully."
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && project) {
      analyzeProject();
    }
  }, [open, project]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return "bg-success text-success-foreground";
      case 'good': return "bg-primary text-primary-foreground";
      case 'average': return "bg-warning text-warning-foreground";
      case 'poor': return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Analytics: {project.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Analyzing project with AI...</span>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.performanceScore)}`}>
                    {analysis.performanceScore}
                  </div>
                  <Progress value={analysis.performanceScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getRatingColor(analysis.efficiencyRating)}>
                    {analysis.efficiencyRating.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on task completion and timeline adherence
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analysis.metrics.completedTasks}/{analysis.metrics.totalTasks}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.metrics.progressRate}% complete
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {analysis.metrics.totalTasks}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {analysis.metrics.completedTasks}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${analysis.metrics.overdueTasks > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {analysis.metrics.overdueTasks}
                    </div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${analysis.metrics.hoursVariance > 20 ? 'text-warning' : 'text-success'}`}>
                      {analysis.metrics.hoursVariance}%
                    </div>
                    <p className="text-sm text-muted-foreground">Hours Variance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Key findings about your project performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.insights.local.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Analysis Results</h4>
                    <ul className="space-y-2">
                      {analysis.insights.local.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.insights.portia && (
                  <div>
                    <Separator className="my-4" />
                    <h4 className="font-medium mb-2">Portia AI Analysis</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">
                        {typeof analysis.insights.portia === 'string' 
                          ? analysis.insights.portia 
                          : "Advanced AI analysis completed - detailed insights available"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable suggestions to improve project efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.recommendations.local.length > 0 && (
                  <div>
                    <ul className="space-y-2">
                      {analysis.recommendations.local.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.recommendations.portia && (
                  <div>
                    <Separator className="my-4" />
                    <h4 className="font-medium mb-2">Portia AI Recommendations</h4>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">
                        {typeof analysis.recommendations.portia === 'string' 
                          ? analysis.recommendations.portia 
                          : "Advanced recommendations generated - check Portia dashboard for details"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={analyzeProject}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Re-analyze
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-4">
              Unable to analyze the project at this time.
            </p>
            <Button onClick={analyzeProject}>
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAnalytics;