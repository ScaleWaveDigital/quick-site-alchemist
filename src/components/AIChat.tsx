import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { X, Send, Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIChatProps {
  projectId: string;
  currentCode: { html: string; css: string; js: string };
  onCodeUpdate: (html: string, css: string, js: string) => void;
  onClose: () => void;
}

const AIChat = ({ projectId, currentCode, onCodeUpdate, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hi! I'm your AI assistant. Tell me what changes you'd like to make to your website. You can also upload an image for reference!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast({ title: "Image selected", description: file.name });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      let imageBase64 = null;
      if (selectedImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedImage);
        });
      }

      const { data, error } = await supabase.functions.invoke('generate-website', {
        body: {
          prompt: userMessage,
          existingCode: currentCode,
          image: imageBase64
        }
      });

      if (error) throw error;

      onCodeUpdate(data.html, data.css, data.js);
      setSelectedImage(null);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I've updated your website! Check the preview to see the changes." 
      }]);
      toast({ title: "Website updated!" });
    } catch (error: any) {
      console.error('AI chat error:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
      toast({ 
        title: "Error updating website", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 border-l flex flex-col glass-panel">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-8"
                  : "bg-muted mr-8"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        {selectedImage && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded flex items-center justify-between">
            <span>{selectedImage.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your changes..."
            rows={2}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            className="gradient-bg"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
