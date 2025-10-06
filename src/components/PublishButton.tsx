import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Rocket, ExternalLink } from "lucide-react";

interface PublishButtonProps {
  project: any;
}

const PublishButton = ({ project }: PublishButtonProps) => {
  const [open, setOpen] = useState(false);

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
            Get a custom domain and connect it to your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
            <h3 className="text-lg font-semibold mb-3">🌐 Get Your Custom Domain</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Purchase a domain from one of these trusted providers to get your website online:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => window.open('https://www.namecheap.com', '_blank')}
              >
                Namecheap <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => window.open('https://www.godaddy.com', '_blank')}
              >
                GoDaddy <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => window.open('https://domains.google', '_blank')}
              >
                Google Domains <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => window.open('https://www.cloudflare.com/products/registrar/', '_blank')}
              >
                Cloudflare <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-muted">
            <h3 className="text-lg font-semibold mb-3">📋 How to Connect Your Domain</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Purchase a domain from any provider above</li>
              <li>Go to your domain registrar's DNS settings</li>
              <li>Add an A record pointing to: <code className="bg-background px-2 py-1 rounded">185.158.133.1</code></li>
              <li>Wait 24-48 hours for DNS propagation</li>
              <li>Your website will be live at your custom domain!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishButton;