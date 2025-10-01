import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PublishButtonProps {
  project: any;
}

const PublishButton = ({ project }: PublishButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const deploymentUrl = `https://deploy.lovable.app/${project.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "URL copied to clipboard!" });
  };

  const handleDeploy = (platform: string) => {
    const deployUrls = {
      vercel: `https://vercel.com/new/clone?repository-url=${encodeURIComponent(deploymentUrl)}`,
      netlify: `https://app.netlify.com/start/deploy?repository=${encodeURIComponent(deploymentUrl)}`,
      cloudflare: `https://dash.cloudflare.com/sign-up/pages`,
    };

    window.open(deployUrls[platform as keyof typeof deployUrls], '_blank');
    toast({ title: `Opening ${platform} deployment...` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gradient-bg">
          <Rocket className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Publish Your Website</DialogTitle>
          <DialogDescription>
            Deploy your website to popular hosting platforms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-2">Your deployment URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-background p-2 rounded">{deploymentUrl}</code>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Choose a platform:</p>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDeploy('vercel')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Deploy to Vercel
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDeploy('netlify')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Deploy to Netlify
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDeploy('cloudflare')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Deploy to Cloudflare Pages
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm">
              <strong>💡 Custom Domain:</strong> After deploying, you can connect your own domain through your chosen platform's settings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishButton;
