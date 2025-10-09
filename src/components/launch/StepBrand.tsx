import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepBrandProps {
  form: UseFormReturn<LaunchFormData>;
}

export const StepBrand = ({ form }: StepBrandProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brand Identity</h2>
        <p className="text-muted-foreground">Define your brand's look and feel</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="brand-tone">Tone of Voice *</Label>
          <Select
            value={form.watch("brand.tone")}
            onValueChange={(value) => form.setValue("brand.tone", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="authoritative">Authoritative</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.brand?.tone && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.brand.tone.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="brand-primary-color">Primary Color *</Label>
            <div className="flex gap-2">
              <Input
                id="brand-primary-color"
                type="color"
                className="w-16 h-10 p-1 cursor-pointer"
                {...form.register("brand.primaryColor")}
              />
              <Input
                type="text"
                placeholder="#000000"
                {...form.register("brand.primaryColor")}
              />
            </div>
            {form.formState.errors.brand?.primaryColor && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.brand.primaryColor.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="brand-secondary-color">Secondary Color *</Label>
            <div className="flex gap-2">
              <Input
                id="brand-secondary-color"
                type="color"
                className="w-16 h-10 p-1 cursor-pointer"
                {...form.register("brand.secondaryColor")}
              />
              <Input
                type="text"
                placeholder="#000000"
                {...form.register("brand.secondaryColor")}
              />
            </div>
            {form.formState.errors.brand?.secondaryColor && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.brand.secondaryColor.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="brand-accent-color">Accent Color *</Label>
            <div className="flex gap-2">
              <Input
                id="brand-accent-color"
                type="color"
                className="w-16 h-10 p-1 cursor-pointer"
                {...form.register("brand.accentColor")}
              />
              <Input
                type="text"
                placeholder="#000000"
                {...form.register("brand.accentColor")}
              />
            </div>
            {form.formState.errors.brand?.accentColor && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.brand.accentColor.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="brand-fonts">Font Family *</Label>
          <Input
            id="brand-fonts"
            placeholder="e.g., Inter, Roboto, Open Sans"
            {...form.register("brand.fonts")}
          />
          {form.formState.errors.brand?.fonts && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.brand.fonts.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="brand-logo">Logo URL (optional)</Label>
          <Input
            id="brand-logo"
            type="url"
            placeholder="https://example.com/logo.png"
            {...form.register("brand.logoUrl")}
          />
          {form.formState.errors.brand?.logoUrl && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.brand.logoUrl.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
