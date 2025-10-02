import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

const LivePreview = ({ html, css, js }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow?.document;
    if (!document) return;

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
      </html>
    `;

    try {
      document.open();
      document.write(fullHTML);
      document.close();
    } catch (error) {
      console.error('Error rendering preview:', error);
    }
  }, [html, css, js]);

  const getIframeWidth = () => {
    switch (viewMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">Preview:</span>
        <Button
          variant={viewMode === "desktop" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("desktop")}
        >
          <Monitor className="h-4 w-4 mr-1" />
          Desktop
        </Button>
        <Button
          variant={viewMode === "tablet" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("tablet")}
        >
          <Tablet className="h-4 w-4 mr-1" />
          Tablet
        </Button>
        <Button
          variant={viewMode === "mobile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("mobile")}
        >
          <Smartphone className="h-4 w-4 mr-1" />
          Mobile
        </Button>
      </div>
      <div className="flex-1 overflow-auto bg-muted/10 flex justify-center items-start p-4">
        <div 
          style={{ 
            width: getIframeWidth(), 
            height: "100%",
            transition: "width 0.3s ease",
            maxWidth: "100%"
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 bg-white shadow-lg rounded"
            title="Website Preview"
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
