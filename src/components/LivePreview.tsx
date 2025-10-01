import { useEffect, useRef } from "react";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

const LivePreview = ({ html, css, js }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      title="Website Preview"
      sandbox="allow-scripts allow-forms allow-modals allow-popups"
    />
  );
};

export default LivePreview;
