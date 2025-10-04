import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, ExternalLink, Copy, Check, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PublishButtonProps {
  project: any;
}

const PublishButton = ({ project }: PublishButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState(project?.custom_domain || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const previewUrl = `https://${project.id}.lovable.app`;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "URL copied to clipboard!" });
  };

  const handlePublishToPreview = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ published_at: new Date().toISOString() })
        .eq("id", project.id);

      if (error) throw error;

      toast({ 
        title: "Website published!",
        description: `Your site is live at ${previewUrl}`
      });
      
      setTimeout(() => {
        window.open(previewUrl, '_blank');
      }, 500);
    } catch (error: any) {
      toast({ 
        title: "Error publishing", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectDomain = async () => {
    if (!customDomain || !customDomain.includes('.')) {
      toast({ 
        title: "Invalid domain", 
        description: "Please enter a valid domain (e.g., mywebsite.com)",
        variant: "destructive" 
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ 
          custom_domain: customDomain,
          published_at: new Date().toISOString(),
          domain_verified: false
        })
        .eq("id", project.id);

      if (error) throw error;

      toast({ 
        title: "Domain connected!",
        description: "Follow the DNS setup instructions below"
      });
    } catch (error: any) {
      toast({ 
        title: "Error connecting domain", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gradient-bg">
          <Rocket className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Your Website</DialogTitle>
          <DialogDescription>
            Publish to a free preview URL or connect your custom domain
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Quick Preview</TabsTrigger>
            <TabsTrigger value="custom">Custom Domain</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">Your preview URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-background p-2 rounded">{previewUrl}</code>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(previewUrl)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handlePublishToPreview} 
              disabled={saving}
              className="w-full gradient-bg"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {saving ? "Publishing..." : "Publish to Preview URL"}
            </Button>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm">
                <strong>💡 Free Preview:</strong> Get a instant preview URL to share your website. Perfect for testing and demos!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Your Domain</Label>
              <div className="flex gap-2">
                <Input
                  id="domain"
                  placeholder="mywebsite.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <Button onClick={handleConnectDomain} disabled={saving}>
                  <Globe className="h-4 w-4 mr-2" />
                  {saving ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </div>

            {customDomain && (
              <div className="p-4 rounded-lg bg-muted space-y-3">
                <p className="text-sm font-medium">DNS Setup Instructions:</p>
                <div className="text-sm space-y-2">
                  <p>Add these DNS records at your domain registrar:</p>
                  <div className="bg-background p-3 rounded space-y-1 font-mono text-xs">
                    <div><strong>Type:</strong> A</div>
                    <div><strong>Name:</strong> @</div>
                    <div><strong>Value:</strong> 185.158.133.1</div>
                  </div>
                  <div className="bg-background p-3 rounded space-y-1 font-mono text-xs">
                    <div><strong>Type:</strong> A</div>
                    <div><strong>Name:</strong> www</div>
                    <div><strong>Value:</strong> 185.158.133.1</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  DNS changes can take up to 24-48 hours to propagate. SSL will be automatically provisioned.
                </p>
              </div>
            )}

            {project.custom_domain && (
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  ✓ Domain Connected: {project.custom_domain}
                </p>
                <p className="text-xs text-muted-foreground">
                  {project.domain_verified 
                    ? "Your domain is verified and live!"
                    : "Waiting for DNS propagation..."}
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm">
                <strong>🌐 Custom Domain:</strong> Connect your own domain and all future changes will automatically update your live website!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PublishButton;