import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DomainConnect from "@/components/DomainConnect";

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({ title: "Error loading projects", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Project deleted" });
      loadProjects();
    } catch (error: any) {
      toast({ title: "Error deleting project", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <Card className="glass-panel">
        <CardContent className="py-12 text-center">
          <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No projects yet. Create your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const projectSlug = project?.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          || project.id;
        const defaultUrl = `https://${projectSlug}.lovable.app`;

        return (
          <Card 
            key={project.id} 
            className="glass-panel hover:border-primary/50 transition-all"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  {project.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(project.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || project.prompt}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>

              {/* Domain Status */}
              {project.custom_domain && (
                <div className="flex items-center gap-2 text-xs">
                  <ExternalLink className="h-3 w-3" />
                  <code className="bg-muted px-2 py-1 rounded">{project.custom_domain}</code>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <DomainConnect project={project} onUpdate={loadProjects} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectsList;
