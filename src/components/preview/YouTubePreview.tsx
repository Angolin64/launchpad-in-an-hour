import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface YouTubePreviewProps {
  content: any;
}

export const YouTubePreview = ({ content }: YouTubePreviewProps) => {
  const scripts = content.scripts || [];

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {scripts.map((script: any, index: number) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-2">Short #{index + 1}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Hook</h4>
                <p className="text-sm">{script.hook}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Main Content</h4>
                <p className="text-sm">{script.content}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Call to Action</h4>
                <p className="text-sm">{script.cta}</p>
              </div>
              {script.hashtags && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Hashtags</h4>
                  <p className="text-sm text-primary">{script.hashtags.join(' ')}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
