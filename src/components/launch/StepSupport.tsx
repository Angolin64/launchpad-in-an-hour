import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { AIHelperButton } from "./AIHelperButton";

interface StepSupportProps {
  form: UseFormReturn<LaunchFormData>;
  onClear: () => void;
}

export const StepSupport = ({ form, onClear }: StepSupportProps) => {
  const [stepInput, setStepInput] = useState("");
  const [linkInput, setLinkInput] = useState("");

  const onboardingSteps = form.watch("support.onboardingSteps") || [];
  const tutorialLinks = form.watch("support.tutorialLinks") || [];
  const productName = form.watch("product.name") || "";
  const productDescription = form.watch("product.description") || "";
  const productPrice = form.watch("product.price") || "";

  const addItem = (field: "onboardingSteps" | "tutorialLinks", value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const currentValues = form.getValues(`support.${field}`) || [];
      form.setValue(`support.${field}`, [...currentValues, value.trim()]);
      setter("");
    }
  };

  const removeItem = (field: "onboardingSteps" | "tutorialLinks", index: number) => {
    const currentValues = form.getValues(`support.${field}`) || [];
    form.setValue(
      `support.${field}`,
      currentValues.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Support Data</h2>
          <p className="text-muted-foreground">Help us create comprehensive support content</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center">
            <Label htmlFor="support-policies">Policies & Terms *</Label>
            <AIHelperButton
              fieldType="supportGreeting"
              context={`Product: ${productName}`}
              onSuggestion={(suggestion) => form.setValue("support.policies", suggestion)}
            />
          </div>
          <Textarea
            id="support-policies"
            placeholder="Refund policy, terms of service, privacy policy highlights..."
            rows={5}
            {...form.register("support.policies")}
          />
          {form.formState.errors.support?.policies && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.support.policies.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <Label htmlFor="support-pricing">Pricing Details *</Label>
            <AIHelperButton
              fieldType="faqQuestions"
              context={`Product: ${productName}. Price: ${productPrice}. Description: ${productDescription}`}
              onSuggestion={(suggestion) => form.setValue("support.pricingDetails", suggestion)}
            />
          </div>
          <Textarea
            id="support-pricing"
            placeholder="Explain your pricing structure, plans, what's included..."
            rows={4}
            {...form.register("support.pricingDetails")}
          />
          {form.formState.errors.support?.pricingDetails && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.support.pricingDetails.message}
            </p>
          )}
        </div>

        <div>
          <Label>Onboarding Steps *</Label>
          <p className="text-sm text-muted-foreground mb-2">What should new users do first?</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g., Create account, Complete profile..."
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("onboardingSteps", stepInput, setStepInput))}
            />
            <Button type="button" onClick={() => addItem("onboardingSteps", stepInput, setStepInput)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {onboardingSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm">{step}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("onboardingSteps", index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.support?.onboardingSteps && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.support.onboardingSteps.message || "At least one onboarding step is required")}
            </p>
          )}
        </div>

        <div>
          <Label>Tutorial Links (optional)</Label>
          <p className="text-sm text-muted-foreground mb-2">Links to guides, videos, docs</p>
          <div className="flex gap-2 mb-2">
            <Input
              type="url"
              placeholder="https://..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("tutorialLinks", linkInput, setLinkInput))}
            />
            <Button type="button" onClick={() => addItem("tutorialLinks", linkInput, setLinkInput)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {tutorialLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                  {link}
                </a>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("tutorialLinks", index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.support?.tutorialLinks && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.support.tutorialLinks.message || "Invalid tutorial links")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
