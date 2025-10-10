import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Youtube, Instagram, Mail, HelpCircle, MessageCircle, Trash2 } from "lucide-react";

interface StepChannelsProps {
  form: UseFormReturn<LaunchFormData>;
  onClear: () => void;
}

export const StepChannels = ({ form, onClear }: StepChannelsProps) => {
  const channels = [
    {
      id: "youtube",
      label: "YouTube Shorts",
      description: "5 viral-ready video scripts",
      icon: Youtube,
    },
    {
      id: "instagram",
      label: "Instagram Carousels",
      description: "Swipeable educational content",
      icon: Instagram,
    },
    {
      id: "email",
      label: "Email Sequence",
      description: "5-email nurture campaign",
      icon: Mail,
    },
    {
      id: "faq",
      label: "Web FAQ",
      description: "20+ organized Q&A pairs",
      icon: HelpCircle,
    },
    {
      id: "chatbot",
      label: "Support Chatbot",
      description: "AI-powered knowledge base",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Content Channels</h2>
          <p className="text-muted-foreground">Select the channels you want to launch with</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:border-primary transition-smooth cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const currentValue = form.getValues(`channels.${channel.id as keyof LaunchFormData["channels"]}`);
                form.setValue(`channels.${channel.id as keyof LaunchFormData["channels"]}`, !currentValue);
              }}
            >
              <Checkbox
                checked={form.watch(`channels.${channel.id as keyof LaunchFormData["channels"]}`)}
                onCheckedChange={(checked) => {
                  form.setValue(`channels.${channel.id as keyof LaunchFormData["channels"]}`, checked as boolean);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <Label className="cursor-pointer font-semibold">{channel.label}</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
              </div>
            </div>
          );
        })}
        {form.formState.errors.channels && (
          <p className="text-sm text-destructive mt-2">
            {String(form.formState.errors.channels.root?.message || form.formState.errors.channels.message || "At least one channel must be selected")}
          </p>
        )}
      </div>
    </div>
  );
};
