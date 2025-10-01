import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code2, Palette, Settings } from "lucide-react";

interface EditorSidebarProps {
  project: any;
  onUpdate: (html: string, css: string, js: string) => void;
}

const EditorSidebar = ({ project, onUpdate }: EditorSidebarProps) => {
  const [html, setHtml] = useState(project.html_code);
  const [css, setCss] = useState(project.css_code);
  const [js, setJs] = useState(project.js_code);

  const handleSave = () => {
    onUpdate(html, css, js);
  };

  return (
    <div className="w-96 border-r flex flex-col glass-panel">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="html">
            <Code2 className="h-4 w-4 mr-2" />
            HTML
          </TabsTrigger>
          <TabsTrigger value="css">
            <Palette className="h-4 w-4 mr-2" />
            CSS
          </TabsTrigger>
          <TabsTrigger value="js">
            <Settings className="h-4 w-4 mr-2" />
            JS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="flex-1 flex flex-col p-2 mt-0">
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="flex-1 font-mono text-sm"
            placeholder="HTML code..."
          />
        </TabsContent>

        <TabsContent value="css" className="flex-1 flex flex-col p-2 mt-0">
          <Textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="flex-1 font-mono text-sm"
            placeholder="CSS code..."
          />
        </TabsContent>

        <TabsContent value="js" className="flex-1 flex flex-col p-2 mt-0">
          <Textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="flex-1 font-mono text-sm"
            placeholder="JavaScript code..."
          />
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <Button onClick={handleSave} className="w-full gradient-bg">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditorSidebar;
