import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { AIHelperButton } from "./AIHelperButton";

interface StepProductProps {
  form: UseFormReturn<LaunchFormData>;
  onClear: () => void;
}

export const StepProduct = ({ form, onClear }: StepProductProps) => {
  const [featureInput, setFeatureInput] = useState("");
  const features = form.watch("product.features") || [];
  const productName = form.watch("product.name") || "";
  const productDescription = form.watch("product.description") || "";

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Product Information</h2>
          <p className="text-muted-foreground">Tell us about your product or service</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center">
            <Label htmlFor="product-name">Product Name *</Label>
            <AIHelperButton
              fieldType="productName"
              context={{}}
              onSuggestion={(suggestion) => form.setValue("product.name", suggestion)}
            />
          </div>
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
          <div className="flex items-center">
            <Label htmlFor="product-description">Description *</Label>
            <AIHelperButton
              fieldType="productDescription"
              context={productName}
              onSuggestion={(suggestion) => form.setValue("product.description", suggestion)}
            />
          </div>
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
          <div className="flex items-center">
            <Label htmlFor="product-price">Price *</Label>
            <AIHelperButton
              fieldType="productPrice"
              context={productDescription}
              onSuggestion={(suggestion) => form.setValue("product.price", suggestion)}
            />
          </div>
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
          <div className="flex items-center">
            <Label htmlFor="product-features">Key Features *</Label>
            <AIHelperButton
              fieldType="productFeatures"
              context={productDescription}
              onSuggestion={(suggestion) => {
                const featuresArray = suggestion.split('\n').filter(f => f.trim());
                form.setValue("product.features", featuresArray);
              }}
            />
          </div>
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
              {String(form.formState.errors.product.features.message || "At least one feature is required")}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <Label htmlFor="product-differentiators">What Makes You Different? *</Label>
            <AIHelperButton
              fieldType="productDifferentiators"
              context={`Product: ${productName}. Description: ${productDescription}`}
              onSuggestion={(suggestion) => form.setValue("product.differentiators", suggestion)}
            />
          </div>
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
