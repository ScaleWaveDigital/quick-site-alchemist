import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Code, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LivePreview from "@/components/LivePreview";
import AIChat from "@/components/AIChat";
import EditorSidebar from "@/components/EditorSidebar";
import ExportButton from "@/components/ExportButton";
import PublishButton from "@/components/PublishButton";

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast({ title: "Error loading project", description: error.message, variant: "destructive" });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCode = async (html: string, css: string, js: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ html_code: html, css_code: css, js_code: js })
        .eq("id", projectId);

      if (error) throw error;
      setProject({ ...project, html_code: html, css_code: css, js_code: js });
      toast({ title: "Changes saved!" });
    } catch (error: any) {
      toast({ title: "Error saving changes", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b glass-panel">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold">{project.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
              {showCode ? <Eye className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
              {showCode ? "Preview Only" : "Show Code"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Edit
            </Button>
            <ExportButton project={project} />
            <PublishButton project={project} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {showCode && <EditorSidebar project={project} onUpdate={handleUpdateCode} />}
        <div className="flex-1 relative">
          <LivePreview 
            html={project.html_code} 
            css={project.css_code} 
            js={project.js_code} 
          />
        </div>
        {showChat && (
          <AIChat
            projectId={project.id}
            currentCode={{ html: project.html_code, css: project.css_code, js: project.js_code }}
            onCodeUpdate={handleUpdateCode}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
