import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortiaConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Portia API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: "Connected Successfully",
        description: "Portia AI is now analyzing your projects and providing insights.",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey("");
    toast({
      title: "Disconnected",
      description: "Portia AI integration has been disabled.",
      variant: "destructive",
    });
  };

  return (
    <Card className="portia-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Portia AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isConnected ? 'bg-success/10' : 'bg-muted'}`}>
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-sm">Connection Status</h4>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? "AI analysis active" : "Not connected"}
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {/* API Configuration */}
          {!isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Portia API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Portia API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is used to authenticate calls to the Portia API and is linked to your organization.
                </p>
              </div>
              
              <Button 
                onClick={handleConnect} 
                disabled={isLoading}
                className="w-full gradient-primary"
              >
                {isLoading ? "Connecting..." : "Connect to Portia AI"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <h5 className="font-medium text-sm">Smart Insights</h5>
                    <p className="text-xs text-muted-foreground">Real-time project analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <h5 className="font-medium text-sm">Secure Connection</h5>
                    <p className="text-xs text-muted-foreground">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleDisconnect} 
                variant="outline"
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortiaConfig;