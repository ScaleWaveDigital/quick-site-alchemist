import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Eye, 
  Download, 
  Globe, 
  Layers, 
  ArrowLeft,
  Code,
  Wand2,
  Settings,
  Share2
} from "lucide-react";
import helpDashboard from "@/assets/help-dashboard.jpg";
import helpEditor from "@/assets/help-editor.jpg";
import helpDomain from "@/assets/help-domain.jpg";

const Help = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "getting-started",
      label: "Getting Started",
      icon: Sparkles,
      sections: [
        {
          title: "Welcome to SiteGenie",
          content: "SiteGenie is an AI-powered website builder that lets you create stunning websites from simple text prompts. No coding knowledge required!",
          image: helpDashboard,
        },
        {
          title: "Creating Your First Project",
          content: "Click 'Create New Project' from your dashboard, enter a description of the website you want to create, and our AI will generate a complete website for you in seconds. You can also start from one of our professionally designed templates.",
        },
      ],
    },
    {
      id: "ai-generation",
      label: "AI Features",
      icon: Wand2,
      sections: [
        {
          title: "AI-Powered Website Generation",
          content: "Simply describe what you want in plain English. Our AI understands your vision and creates a fully functional website with beautiful design, responsive layout, and professional content.",
          icon: Sparkles,
        },
        {
          title: "AI Chat Assistant",
          content: "Need to make changes? Chat with our AI assistant in the editor. Ask it to change colors, add sections, modify content, or completely redesign parts of your website. The AI understands natural language and makes instant updates.",
          icon: Wand2,
          image: helpEditor,
        },
      ],
    },
    {
      id: "editor",
      label: "Editor & Preview",
      icon: Code,
      sections: [
        {
          title: "Live Preview",
          content: "See your website in real-time as you make changes. The live preview updates instantly, showing exactly how your site will look to visitors. Test on different screen sizes to ensure perfect responsive design.",
          icon: Eye,
        },
        {
          title: "Code Editor",
          content: "For advanced users, toggle the code view to see and edit the HTML, CSS, and JavaScript directly. Changes are reflected immediately in the preview.",
          icon: Code,
        },
      ],
    },
    {
      id: "templates",
      label: "Templates",
      icon: Layers,
      sections: [
        {
          title: "Professional Templates",
          content: "Choose from our collection of professionally designed templates for different industries and purposes. Each template is fully customizable and can be modified using AI or manual editing.",
          icon: Layers,
        },
        {
          title: "Customizing Templates",
          content: "Start with a template and use the AI assistant to customize it to your needs. Change colors, layouts, content, and features with simple text commands.",
        },
      ],
    },
    {
      id: "publishing",
      label: "Publishing & Domains",
      icon: Globe,
      sections: [
        {
          title: "Publishing Your Website",
          content: "When you're ready to go live, click the 'Publish' button. Your website will be deployed instantly and accessible via a unique URL. Changes you make are updated in real-time.",
          icon: Share2,
        },
        {
          title: "Connecting Custom Domains",
          content: "Want to use your own domain name? Navigate to your project in the dashboard and click 'Connect Domain'. Enter your custom domain (e.g., www.yourbusiness.com) and follow the DNS setup instructions provided.",
          image: helpDomain,
        },
        {
          title: "DNS Setup Guide",
          content: "To connect your domain, you'll need to add two DNS records at your domain registrar:\n\n1. A Record for @ pointing to 185.158.133.1\n2. CNAME Record for www pointing to your project URL\n\nOnce configured, the system will automatically verify the connection. This usually takes 1-48 hours depending on your DNS provider.",
        },
        {
          title: "Exporting Your Website",
          content: "Download your website as a complete package including all HTML, CSS, JavaScript, and assets. Host it anywhere you like or keep it as a backup.",
          icon: Download,
        },
      ],
    },
    {
      id: "management",
      label: "Project Management",
      icon: Settings,
      sections: [
        {
          title: "Managing Your Projects",
          content: "All your projects are displayed on the dashboard. Click any project to open it in the editor. Use the menu on each project card to rename, duplicate, or delete projects.",
        },
        {
          title: "Project Settings",
          content: "Access project settings to configure domain connections, export options, and other advanced features. Each project maintains its own settings and configuration.",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Help Center</h1>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about SiteGenie
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 py-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">{category.label}</h2>
              </div>

              {category.sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.icon && <section.icon className="h-5 w-5 text-primary" />}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-muted-foreground whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.image && (
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => navigate("/dashboard")}
              >
                <Sparkles className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Create New Project</span>
                <span className="text-xs text-muted-foreground">
                  Start building your website
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => navigate("/dashboard")}
              >
                <Layers className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Browse Templates</span>
                <span className="text-xs text-muted-foreground">
                  Start from a design
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => navigate("/dashboard")}
              >
                <Globe className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Connect Domain</span>
                <span className="text-xs text-muted-foreground">
                  Use your custom domain
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => navigate("/dashboard")}
              >
                <Share2 className="h-5 w-5 mb-2 text-primary" />
                <span className="font-medium">Publish Website</span>
                <span className="text-xs text-muted-foreground">
                  Make your site live
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
