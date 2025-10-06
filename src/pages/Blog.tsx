import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const videos = [
    {
      id: "Sxxw3qtb3_g",
      title: "How to Build a Website with AI in 2024",
      description: "Learn the fundamentals of using AI-powered website builders to create professional websites without coding. This tutorial covers the essential steps and best practices for modern web development."
    },
    {
      id: "pQN-pnXPaVg",
      title: "ChatGPT Tutorial for Beginners - How to Use AI",
      description: "A comprehensive guide to ChatGPT and how to leverage AI for productivity. Perfect for beginners wanting to understand AI tools and their practical applications in daily work."
    },
    {
      id: "f60dheI4ARg",
      title: "How to Make Money Online for Beginners",
      description: "Explore legitimate ways to earn income online, from freelancing to digital products. This guide covers proven strategies and practical tips for building sustainable online income streams."
    },
    {
      id: "UmnCZ7-9yDY",
      title: "Web Design Tutorial - Complete Guide for Beginners",
      description: "Master the principles of modern web design including layout, color theory, typography, and user experience. This tutorial provides actionable insights for creating beautiful, functional websites."
    },
    {
      id: "kqtD5dpn9C8",
      title: "AI Tools Every Entrepreneur Should Know",
      description: "Discover the most powerful AI tools that can automate tasks, boost productivity, and help scale your business. From content creation to data analysis, learn how AI can transform your workflow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Learning Resources</h1>
          <p className="text-muted-foreground text-lg">
            Watch these educational videos to learn about website building, AI tools, and online business strategies.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {video.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;
