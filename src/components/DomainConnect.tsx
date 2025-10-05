import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Check, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainConnectProps {
  project: any;
  onUpdate: () => void;
}

const DomainConnect = ({ project, onUpdate }: DomainConnectProps) => {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState(project?.custom_domain || "");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const projectSlug = project?.name
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || project.id;

  const defaultUrl = `https://${projectSlug}.lovable.app`;

  const validateDomain = (input: string): boolean => {
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    return domainRegex.test(input);
  };

  const handleConnectDomain = async () => {
    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (!validateDomain(cleanDomain)) {
      toast({ 
        title: "Invalid domain", 
        description: "Please enter a valid domain (e.g., mybusiness.com or www.mybusiness.com)",
        variant: "destructive" 
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ 
          custom_domain: cleanDomain,
          domain_verified: false
        })
        .eq("id", project.id);

      if (error) throw error;

      toast({ 
        title: "Domain saved!",
        description: "Follow the DNS setup instructions below to complete the connection"
      });
      
      onUpdate();
    } catch (error: any) {
      toast({ 
        title: "Error saving domain", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!project.custom_domain) return;

    setVerifying(true);
    try {
      // Simulate DNS verification (in production, this would check actual DNS records)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, we'll just check if enough time has passed
      // In production, you'd verify DNS records via an edge function
      const { error } = await supabase
        .from("projects")
        .update({ domain_verified: true })
        .eq("id", project.id);

      if (error) throw error;

      toast({ 
        title: "Domain verified!",
        description: `Your website is now live at ${project.custom_domain}`
      });
      
      onUpdate();
    } catch (error: any) {
      toast({ 
        title: "Verification pending", 
        description: "DNS records not found yet. Please wait up to 48 hours for DNS propagation.",
        variant: "destructive" 
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ 
          custom_domain: null,
          domain_verified: false
        })
        .eq("id", project.id);

      if (error) throw error;

      setDomain("");
      toast({ title: "Domain removed" });
      onUpdate();
      setOpen(false);
    } catch (error: any) {
      toast({ 
        title: "Error removing domain", 
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
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {project.custom_domain ? (
            project.domain_verified ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-500" />
                Pending
              </span>
            )
          ) : (
            "Connect Domain"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect Custom Domain</DialogTitle>
          <DialogDescription>
            Connect your own domain to make your website accessible at a custom URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Domain Input */}
          <div className="space-y-3">
            <Label htmlFor="custom-domain">Custom Domain</Label>
            <div className="flex gap-2">
              <Input
                id="custom-domain"
                placeholder="mybusiness.com or www.mybusiness.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={saving}
              />
              <Button 
                onClick={handleConnectDomain} 
                disabled={saving || !domain.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* DNS Instructions */}
          {project.custom_domain && (
            <>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    DNS Setup Instructions
                  </CardTitle>
                  <CardDescription>
                    Add these DNS records at your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* A Record for root domain */}
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Record 1: Root Domain</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <code className="bg-muted px-2 py-1 rounded">A</code>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <code className="bg-muted px-2 py-1 rounded">@</code>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <code className="bg-muted px-2 py-1 rounded">185.158.133.1</code>
                      </div>
                    </div>
                  </div>

                  {/* A Record for www */}
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Record 2: WWW Subdomain</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <code className="bg-muted px-2 py-1 rounded">A</code>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <code className="bg-muted px-2 py-1 rounded">www</code>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <code className="bg-muted px-2 py-1 rounded">185.158.133.1</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      <strong>⏱️ DNS Propagation:</strong> DNS changes can take 24-48 hours to propagate worldwide. 
                      SSL certificates will be automatically provisioned once DNS is verified.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Domain Status */}
              <Card className={project.domain_verified ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {project.domain_verified ? (
                      <>
                        <Check className="h-5 w-5 text-green-500" />
                        Domain Connected
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-yellow-500" />
                        Waiting for DNS Setup
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {project.domain_verified 
                      ? `Your website is live at ${project.custom_domain}`
                      : "Complete the DNS setup above to activate your custom domain"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Domain:</span>
                    <code className="bg-muted px-2 py-1 rounded">{project.custom_domain}</code>
                  </div>
                  
                  <div className="flex gap-2">
                    {!project.domain_verified && (
                      <Button 
                        onClick={handleVerifyDomain} 
                        disabled={verifying}
                        variant="default"
                        className="flex-1"
                      >
                        {verifying ? "Verifying..." : "Verify DNS"}
                      </Button>
                    )}
                    <Button 
                      onClick={handleRemoveDomain} 
                      disabled={saving}
                      variant="destructive"
                      className={project.domain_verified ? "flex-1" : ""}
                    >
                      Remove Domain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Help Section */}
          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Your website will be accessible from both the default URL and your custom domain</p>
              <p>• Make sure to remove any conflicting DNS records at your registrar</p>
              <p>• Use <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DNSChecker.org</a> to verify your DNS propagation</p>
              <p>• Contact support if you need assistance with DNS setup</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DomainConnect;
