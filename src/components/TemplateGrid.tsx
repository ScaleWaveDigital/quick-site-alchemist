import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, UtensilsCrossed, BookOpen } from "lucide-react";

const templates = [
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio with projects and contact",
    icon: Code,
    prompt: "Create a modern portfolio website with a hero section, about me section, projects gallery with 6 project cards, skills section, and a contact form with name, email, and message fields. Use a clean, professional design with smooth animations.",
  },
  {
    id: "business",
    name: "Business",
    description: "Professional business landing page",
    icon: Briefcase,
    prompt: "Create a business website with a hero section with CTA button, services section with 4 service cards, about us section, testimonials slider with 3 testimonials, pricing table with 3 tiers, and a contact section with a working form. Use a corporate, trustworthy design.",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Restaurant menu and booking site",
    icon: UtensilsCrossed,
    prompt: "Create a restaurant website with a hero section with food images, menu section organized by categories (appetizers, mains, desserts), reservation form with date/time picker, about section with chef story, gallery of food photos, and contact information with map. Use warm, appetizing colors.",
  },
  {
    id: "blog",
    name: "Blog",
    description: "Content-rich blog template",
    icon: BookOpen,
    prompt: "Create a blog website with a header with navigation, featured post hero section, grid of 6 blog post cards with images and excerpts, categories sidebar, about the author section, newsletter signup form, and footer with social links. Use a clean, readable design focused on typography.",
  },
];

interface TemplateGridProps {
  onSelectTemplate: (template: typeof templates[0]) => void;
}

const TemplateGrid = ({ onSelectTemplate }: TemplateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <Card key={template.id} className="glass-panel hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onSelectTemplate(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TemplateGrid;
