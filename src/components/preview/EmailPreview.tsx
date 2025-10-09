import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "lucide-react";

interface EmailPreviewProps {
  content: any;
}

export const EmailPreview = ({ content }: EmailPreviewProps) => {
  const emails = content.emails || [];

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {emails.map((email: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Email #{index + 1}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Subject Line</h4>
                <p className="text-sm font-semibold">{email.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Preview Text</h4>
                <p className="text-sm text-muted-foreground italic">{email.preview}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Body</h4>
                <div className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-md">
                  {email.body}
                </div>
              </div>
              {email.cta && (
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Call to Action</h4>
                  <p className="text-sm font-medium text-primary">{email.cta}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
