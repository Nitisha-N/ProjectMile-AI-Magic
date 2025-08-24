import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  ArrowRight
} from "lucide-react";

const AIInsights = () => {
  const insights = [
    {
      type: "optimization",
      title: "Sprint Velocity Trending Up",
      description: "Your team's velocity increased 23% this sprint. Consider maintaining current workload distribution.",
      priority: "high",
      icon: TrendingUp,
      action: "View Details"
    },
    {
      type: "warning",
      title: "Potential Bottleneck Detected",
      description: "Backend team has 8 blocked tasks. Recommend daily sync with DevOps team.",
      priority: "urgent",
      icon: AlertTriangle,
      action: "Resolve Now"
    },
    {
      type: "suggestion",
      title: "Resource Reallocation Opportunity",
      description: "Frontend capacity available. Consider moving 2 UI tasks from next sprint to current.",
      priority: "medium",
      icon: Lightbulb,
      action: "Review"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Card className="portia-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="gradient-accent p-2 rounded-lg ai-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className={`p-2 rounded-lg ${
                insight.type === 'warning' ? 'bg-destructive/10' :
                insight.type === 'optimization' ? 'bg-success/10' :
                'bg-accent/10'
              }`}>
                <insight.icon className={`h-4 w-4 ${
                  insight.type === 'warning' ? 'text-destructive' :
                  insight.type === 'optimization' ? 'text-success' :
                  'text-accent'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  {insight.action}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;