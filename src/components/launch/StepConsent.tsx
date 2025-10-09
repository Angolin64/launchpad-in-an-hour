import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

interface StepConsentProps {
  form: UseFormReturn<LaunchFormData>;
}

export const StepConsent = ({ form }: StepConsentProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Final Step: Consent</h2>
        <p className="text-muted-foreground">We need your permission to generate content</p>
      </div>

      <div className="p-6 rounded-lg border-2 border-border bg-muted/30">
        <div className="flex items-start gap-4 mb-4">
          <Shield className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg mb-2">AI Training & Content Generation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              By checking the box below, you consent to us using your product information to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-2">
              <li>Generate marketing content using AI</li>
              <li>Train our AI models to improve future generations</li>
              <li>Store your inputs for content customization</li>
              <li>Create personalized support materials</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-3">
              Your data is encrypted and will never be shared with third parties. You can request deletion at any time.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 mt-6 p-4 bg-background rounded-md">
          <Checkbox
            id="consent"
            checked={form.watch("consent.aiTrainingConsent")}
            onCheckedChange={(checked) => {
              form.setValue("consent.aiTrainingConsent", checked as boolean);
            }}
          />
          <div className="flex-1">
            <Label htmlFor="consent" className="cursor-pointer font-medium">
              I consent to AI training and content generation *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Required to proceed with content generation
            </p>
          </div>
        </div>

        {form.formState.errors.consent?.aiTrainingConsent && (
          <p className="text-sm text-destructive mt-2">
            {form.formState.errors.consent.aiTrainingConsent.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-sm text-foreground">
          <strong>Note:</strong> Once you proceed, our AI will begin generating your content. This typically takes 5-10 minutes depending on the channels selected.
        </p>
      </div>
    </div>
  );
};
