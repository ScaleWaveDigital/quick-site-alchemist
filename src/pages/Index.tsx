import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Code, Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-6xl font-bold gradient-text">SiteGenie</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create fully functional websites from a simple text prompt. 
            No coding required. Powered by AI.
          </p>
          <Button 
            size="lg" 
            className="gradient-bg text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Building
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="glass-panel">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>AI-Powered Generation</CardTitle>
              <CardDescription>
                Describe your website in plain English and watch AI build it instantly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Live Preview & Edit</CardTitle>
              <CardDescription>
                See changes in real-time and refine with AI or manual code editing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <Rocket className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Export & Deploy</CardTitle>
              <CardDescription>
                Download as .zip or deploy instantly to Vercel, Netlify, or Cloudflare
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ready to create something amazing?</p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/auth")}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
