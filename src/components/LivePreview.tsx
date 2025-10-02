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
    const document = iframe.contentDocument;
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

    document.open();
    document.write(fullHTML);
    document.close();
  }, [html, css, js]);

  const getIframeWidth = () => {
    switch (viewMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b bg-background">
        <Button
          variant={viewMode === "desktop" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("desktop")}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "tablet" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("tablet")}
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "tablet" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("mobile")}
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto bg-muted/20 flex justify-center items-start p-4">
        <iframe
          ref={iframeRef}
          style={{ width: getIframeWidth(), height: "100%", transition: "width 0.3s ease" }}
          className="border-0 bg-white shadow-lg"
          title="Website Preview"
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
};

export default LivePreview;
