import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";

interface StepAudienceProps {
  form: UseFormReturn<LaunchFormData>;
  onClear: () => void;
}

export const StepAudience = ({ form, onClear }: StepAudienceProps) => {
  const [painPointInput, setPainPointInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [objectionInput, setObjectionInput] = useState("");

  const painPoints = form.watch("audience.painPoints") || [];
  const goals = form.watch("audience.goals") || [];
  const objections = form.watch("audience.objections") || [];

  const addItem = (field: "painPoints" | "goals" | "objections", value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const currentValues = form.getValues(`audience.${field}`) || [];
      form.setValue(`audience.${field}`, [...currentValues, value.trim()]);
      setter("");
    }
  };

  const removeItem = (field: "painPoints" | "goals" | "objections", index: number) => {
    const currentValues = form.getValues(`audience.${field}`) || [];
    form.setValue(
      `audience.${field}`,
      currentValues.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Target Audience</h2>
          <p className="text-muted-foreground">Help us understand who you're serving</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="audience-niche">Niche / Industry *</Label>
          <Input
            id="audience-niche"
            placeholder="e.g., SaaS founders, E-commerce brands"
            {...form.register("audience.niche")}
          />
          {form.formState.errors.audience?.niche && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.audience.niche.message}
            </p>
          )}
        </div>

        <div>
          <Label>Pain Points *</Label>
          <p className="text-sm text-muted-foreground mb-2">What problems does your audience face?</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a pain point..."
              value={painPointInput}
              onChange={(e) => setPainPointInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("painPoints", painPointInput, setPainPointInput))}
            />
            <Button type="button" onClick={() => addItem("painPoints", painPointInput, setPainPointInput)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {painPoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm">{point}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("painPoints", index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.audience?.painPoints && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.audience.painPoints.message || "At least one pain point is required")}
            </p>
          )}
        </div>

        <div>
          <Label>Goals *</Label>
          <p className="text-sm text-muted-foreground mb-2">What does your audience want to achieve?</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a goal..."
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("goals", goalInput, setGoalInput))}
            />
            <Button type="button" onClick={() => addItem("goals", goalInput, setGoalInput)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm">{goal}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("goals", index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.audience?.goals && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.audience.goals.message || "At least one goal is required")}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="audience-language">Primary Language *</Label>
          <Input
            id="audience-language"
            placeholder="e.g., English, Spanish, French"
            {...form.register("audience.language")}
          />
          {form.formState.errors.audience?.language && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.audience.language.message}
            </p>
          )}
        </div>

        <div>
          <Label>Common Objections *</Label>
          <p className="text-sm text-muted-foreground mb-2">What concerns might they have?</p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add an objection..."
              value={objectionInput}
              onChange={(e) => setObjectionInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("objections", objectionInput, setObjectionInput))}
            />
            <Button type="button" onClick={() => addItem("objections", objectionInput, setObjectionInput)} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {objections.map((objection, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm">{objection}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("objections", index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.audience?.objections && (
            <p className="text-sm text-destructive mt-1">
              {String(form.formState.errors.audience.objections.message || "At least one objection is required")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
