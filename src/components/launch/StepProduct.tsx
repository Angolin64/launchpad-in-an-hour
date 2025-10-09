import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface StepProductProps {
  form: UseFormReturn<LaunchFormData>;
}

export const StepProduct = ({ form }: StepProductProps) => {
  const [featureInput, setFeatureInput] = useState("");
  const features = form.watch("product.features") || [];

  const addFeature = () => {
    if (featureInput.trim()) {
      form.setValue("product.features", [...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    form.setValue(
      "product.features",
      features.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Information</h2>
        <p className="text-muted-foreground">Tell us about your product or service</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="product-name">Product Name *</Label>
          <Input
            id="product-name"
            placeholder="e.g., LaunchKit Pro"
            {...form.register("product.name")}
          />
          {form.formState.errors.product?.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.product.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="product-description">Description *</Label>
          <Textarea
            id="product-description"
            placeholder="Describe what your product does and who it's for..."
            rows={4}
            {...form.register("product.description")}
          />
          {form.formState.errors.product?.description && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.product.description.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="product-price">Price *</Label>
          <Input
            id="product-price"
            placeholder="e.g., $249 one-time or $29/month"
            {...form.register("product.price")}
          />
          {form.formState.errors.product?.price && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.product.price.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="product-features">Key Features *</Label>
          <div className="flex gap-2 mb-2">
            <Input
              id="product-features"
              placeholder="Add a feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <span className="text-sm">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.product?.features && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.product.features.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="product-differentiators">What Makes You Different? *</Label>
          <Textarea
            id="product-differentiators"
            placeholder="What sets you apart from competitors?"
            rows={4}
            {...form.register("product.differentiators")}
          />
          {form.formState.errors.product?.differentiators && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.product.differentiators.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
