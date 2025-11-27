import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, LogOut, HelpCircle, Shield, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemplateGrid from "@/components/TemplateGrid";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import ProjectsList from "@/components/ProjectsList";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Clear any invalid session data
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }
        
        setUser(session.user);
      } catch (err) {
        console.error("Auth error:", err);
        await supabase.auth.signOut();
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({ title: "Signed out successfully" });
  };

  if (loading || !user) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">SiteGenie</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/blog")}>
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/privacy")}>
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/help")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Projects</h2>
            <p className="text-muted-foreground">Create and manage your AI-generated websites</p>
          </div>
          <CreateProjectDialog>
            <Button className="gradient-bg">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </CreateProjectDialog>
        </div>

        <ProjectsList />

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Start from a Template</h3>
          <TemplateGrid onSelectTemplate={(template) => {
            setShowTemplates(false);
          }} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
