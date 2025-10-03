import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

interface CreateProjectDialogProps {
  children: React.ReactNode;
  templatePrompt?: string;
}

const CreateProjectDialog = ({ children, templatePrompt }: CreateProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState(templatePrompt || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !prompt.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate website code using AI
      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-website', {
        body: { prompt, existingCode: null }
      });

      if (functionError) throw functionError;

      // Save project to database
      const { data: project, error: dbError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name,
          prompt,
          html_code: functionData.html,
          css_code: functionData.css,
          js_code: functionData.js,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({ title: "Project created successfully!" });
      setOpen(false);
      navigate(`/editor/${project.id}`);
    } catch (error: any) {
      console.error('Create project error:', error);
      toast({ 
        title: "Error creating project", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Describe your website and let AI build it for you
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe Your Website</Label>
            <Textarea
              id="prompt"
              placeholder="Create a portfolio website with a home page, about section, project gallery, and contact form..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
            />
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={loading}
            className="w-full gradient-bg"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Website...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
