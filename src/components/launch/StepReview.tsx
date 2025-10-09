import { UseFormReturn } from "react-hook-form";
import { LaunchFormData } from "@/types/launch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface StepReviewProps {
  form: UseFormReturn<LaunchFormData>;
  onEditStep: (step: number) => void;
}

export const StepReview = ({ form, onEditStep }: StepReviewProps) => {
  const data = form.getValues();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Information</h2>
        <p className="text-muted-foreground">Double-check everything before submitting</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Product Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(0)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Name:</span> {data.product.name}
            </div>
            <div>
              <span className="font-semibold">Price:</span> {data.product.price}
            </div>
            <div>
              <span className="font-semibold">Features:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.product.features.map((feature, i) => (
                  <Badge key={i} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Target Audience</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Niche:</span> {data.audience.niche}
            </div>
            <div>
              <span className="font-semibold">Language:</span> {data.audience.language}
            </div>
            <div>
              <span className="font-semibold">Pain Points:</span> {data.audience.painPoints.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Brand Identity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Tone:</span> {data.brand.tone}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Colors:</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: data.brand.primaryColor }} />
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: data.brand.secondaryColor }} />
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: data.brand.accentColor }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Content Channels</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.channels.youtube && <Badge>YouTube Shorts</Badge>}
              {data.channels.instagram && <Badge>Instagram</Badge>}
              {data.channels.email && <Badge>Email</Badge>}
              {data.channels.faq && <Badge>FAQ</Badge>}
              {data.channels.chatbot && <Badge>Chatbot</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Support Data</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(4)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="text-sm">
            <div>
              <span className="font-semibold">Onboarding Steps:</span> {data.support.onboardingSteps.length}
            </div>
            <div>
              <span className="font-semibold">Tutorial Links:</span> {data.support.tutorialLinks.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Consent</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={data.consent.aiTrainingConsent ? "default" : "destructive"}>
                {data.consent.aiTrainingConsent ? "✓ Granted" : "✗ Not Granted"}
              </Badge>
              <span>AI Training Consent</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
