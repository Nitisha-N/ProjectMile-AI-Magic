import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  Sparkles,
  AlertTriangle
} from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this week",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Team Members",
      value: "24",
      change: "4 online now",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Completed Tasks",
      value: "156",
      change: "+18 today",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "2 urgent",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="portia-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;